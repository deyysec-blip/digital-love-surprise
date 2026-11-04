/**
 * ===================================================================
 * A DIGITAL LOVE SURPRISE FOR AA FAJAR MAULANA YUSUF ❤️
 * Main Controller: Audio, Scene Sequence & Interactivity
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -----------------------------------------------------------------
  // 1. ENGINE & DOM REFERENCES
  // -----------------------------------------------------------------
  const heartEngine = new window.WordHeartEngine('heartCanvas');

  const btnOpen = document.getElementById('btn-open');
  const sceneOpening = document.getElementById('scene-opening');
  const audioController = document.getElementById('audio-controller');
  const bgMusic = document.getElementById('bgMusic');
  const btnToggleMusic = document.getElementById('btn-toggle-music');
  const audioBars = document.getElementById('audio-bars');
  const volumeSlider = document.getElementById('volume-slider');

  // Message Cards
  const msgScene4 = document.getElementById('msg-scene4');
  const msgScene5 = document.getElementById('msg-scene5');
  const msgScene6 = document.getElementById('msg-scene6');

  // Letter navigation
  const letterParagraphs = document.querySelectorAll('.letter-paragraph');
  const letterDots = document.querySelectorAll('.letter-dot');
  const letterCounter = document.getElementById('letter-counter');
  const btnLetterNext = document.getElementById('btn-letter-next');

  let currentLetterIdx = 0;
  let letterAutoAdvanceTimer = null;
  let timelineTimeouts = [];

  // -----------------------------------------------------------------
  // 2. AUDIO MANAGEMENT
  // -----------------------------------------------------------------
  // Initial volume 45% (as specified in instructions)
  const INITIAL_VOLUME = 0.45;
  const FOCUS_VOLUME = 0.30;
  bgMusic.volume = INITIAL_VOLUME;
  if (volumeSlider) volumeSlider.value = INITIAL_VOLUME;

  let isAudioPlaying = false;
  let currentTargetVolume = INITIAL_VOLUME;
  let volumeFadeAnimId = null;

  function playAudio() {
    bgMusic.play()
      .then(() => {
        isAudioPlaying = true;
        updateAudioUI(true);
      })
      .catch((err) => {
        console.warn('Audio play auto-policy warning:', err);
        // Fallback UI indication
        updateAudioUI(false);
      });
  }

  function pauseAudio() {
    bgMusic.pause();
    isAudioPlaying = false;
    updateAudioUI(false);
  }

  function toggleAudio() {
    if (bgMusic.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function updateAudioUI(playing) {
    if (playing) {
      audioBars.classList.add('playing');
      btnToggleMusic.setAttribute('aria-label', 'Pause Musik');
    } else {
      audioBars.classList.remove('playing');
      btnToggleMusic.setAttribute('aria-label', 'Play Musik');
    }
  }

  // Smooth Volume Fade (to transition smoothly during letter reading)
  function fadeAudioVolume(targetVol, durationMs = 2000) {
    if (volumeFadeAnimId) cancelAnimationFrame(volumeFadeAnimId);
    currentTargetVolume = Math.max(0, Math.min(1, targetVol));

    const startVol = bgMusic.volume;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Smooth ease
      const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      const newVol = startVol + (targetVol - startVol) * ease;
      
      bgMusic.volume = newVol;
      if (volumeSlider) volumeSlider.value = newVol;

      if (progress < 1) {
        volumeFadeAnimId = requestAnimationFrame(step);
      }
    }
    volumeFadeAnimId = requestAnimationFrame(step);
  }

  if (btnToggleMusic) {
    btnToggleMusic.addEventListener('click', toggleAudio);
  }
  if (audioBars) {
    audioBars.addEventListener('click', toggleAudio);
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      bgMusic.volume = val;
      if (val > 0 && bgMusic.paused) {
        playAudio();
      }
    });
  }

  // -----------------------------------------------------------------
  // 3. SCENE CONTROLLER & TIMELINE
  // -----------------------------------------------------------------
  function clearAllTimeouts() {
    timelineTimeouts.forEach(clearTimeout);
    timelineTimeouts = [];
    if (typeof clearLetterTimer === 'function') {
      clearLetterTimer();
    }
  }

  function hideAllCards() {
    [msgScene4, msgScene5, msgScene6].forEach((card) => {
      if (card) card.classList.remove('active');
    });
  }

  // Triggered when "BUKA HADIAH ❤️" is clicked
  btnOpen.addEventListener('click', () => {
    // 1. Play romantic song
    playAudio();

    // 2. Reveal audio controller
    audioController.classList.add('visible');

    // 3. Fade out opening screen
    sceneOpening.classList.add('fade-out');

    // 4. Begin gathering word particles into the heart
    heartEngine.startGathering();

    // 5. Start Timeline
    runStoryTimeline();
  });

  function scheduleStep(callback, delayMs) {
    const tid = setTimeout(callback, delayMs);
    timelineTimeouts.push(tid);
    return tid;
  }

  function runStoryTimeline(isReplay = false) {
    clearAllTimeouts();
    hideAllCards();

    // If replaying, heart is already beating
    const delayBase = isReplay ? 600 : 4200;

    // --- STEP 1: ADEGAN 4 - MAIN LOVE MESSAGE ---
    // "I LOVE YOU / SAYANGKU GANTENGKU / AA FAJAR MAULANA YUSUF"
    scheduleStep(() => {
      hideAllCards();
      msgScene4.classList.add('active');
    }, delayBase);

    // --- STEP 2: ADEGAN 5 - SPECIAL LOVE MESSAGE ---
    // "I LOVE YOU, SAYANGKU GANTENGKU ❤️ / AA FAJAR MAULANA YUSUF"
    scheduleStep(() => {
      msgScene4.classList.remove('active');
      scheduleStep(() => {
        msgScene5.classList.add('active');
      }, 500);
    }, delayBase + 5500);

    // --- STEP 3: ADEGAN 6 - PESAN PENYEMANGAT UNTUK AA FAJAR ---
    scheduleStep(() => {
      msgScene5.classList.remove('active');

      // Softly reduce music volume to create an intimate atmosphere
      fadeAudioVolume(FOCUS_VOLUME, 2200);

      // Relax heart scale slightly to frame the letter card
      heartEngine.setFocusMode(true);

      scheduleStep(() => {
        msgScene6.classList.add('active');
        startLetterSequence();
      }, 600);

    }, delayBase + 11500);
  }

  // -----------------------------------------------------------------
  // 4. LETTER SEQUENCE (PARAGRAPH BY PARAGRAPH)
  // -----------------------------------------------------------------
  // Custom reading delays per paragraph (ms) for comfortable pacing
  const PARAGRAPH_DELAYS = [5000, 7000, 5200, 4800];
  let letterTimer = null;
  let hasReachedFinale = false;

  function clearLetterTimer() {
    if (letterTimer) {
      clearTimeout(letterTimer);
      letterTimer = null;
    }
  }

  function showLetterParagraph(index) {
    if (index < 0 || index >= letterParagraphs.length || hasReachedFinale) return;

    currentLetterIdx = index;

    letterParagraphs.forEach((p, i) => {
      p.classList.remove('active', 'passed');
      if (i === index) {
        p.classList.add('active');
      } else if (i < index) {
        p.classList.add('passed');
      }
    });

    letterDots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (letterCounter) {
      letterCounter.textContent = `${index + 1} / ${letterParagraphs.length}`;
    }

    // Button label changes on last paragraph
    if (btnLetterNext) {
      if (index === letterParagraphs.length - 1) {
        btnLetterNext.innerHTML = `SELESAI <span style="font-size: 1rem;">❤️</span>`;
      } else {
        btnLetterNext.innerHTML = `LANJUT <span style="font-size: 0.9rem;">❯</span>`;
      }
    }

    // Schedule automatic progression after comfortable reading pause
    clearLetterTimer();
    const delay = PARAGRAPH_DELAYS[index] || 5000;
    letterTimer = setTimeout(() => {
      if (currentLetterIdx < letterParagraphs.length - 1) {
        showLetterParagraph(currentLetterIdx + 1);
      } else {
        // Last paragraph finished reading -> direct transition to I LOVE YOU FOREVER
        finishLetterAndShowFinale();
      }
    }, delay);
  }

  function startLetterSequence() {
    hasReachedFinale = false;
    showLetterParagraph(0);
  }

  if (btnLetterNext) {
    btnLetterNext.addEventListener('click', () => {
      clearLetterTimer();
      if (currentLetterIdx < letterParagraphs.length - 1) {
        showLetterParagraph(currentLetterIdx + 1);
      } else {
        finishLetterAndShowFinale();
      }
    });
  }

  // Tap on dots to navigate directly
  letterDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearLetterTimer();
      showLetterParagraph(i);
    });
  });

  // -----------------------------------------------------------------
  // 5. FINAL SCREEN: ANIMATED TEXT HEART ONLY (REFERENCE IMAGE STYLE)
  // -----------------------------------------------------------------
  function finishLetterAndShowFinale() {
    if (hasReachedFinale) return;
    hasReachedFinale = true;
    clearLetterTimer();

    // Smoothly fade out the motivational message card
    if (msgScene6) msgScene6.classList.remove('active');

    // Fade out any other UI overlays so ONLY the animated text heart is visible
    hideAllCards();
    if (audioController) {
      audioController.classList.remove('visible');
      audioController.style.transition = 'opacity 1.5s ease';
      audioController.style.opacity = '0';
      audioController.style.pointerEvents = 'none';
    }

    // Restore full romantic music volume smoothly without interruption
    fadeAudioVolume(INITIAL_VOLUME, 2500);

    // Transition heart engine to final permanent mode (centered, beating, full neon glow)
    heartEngine.setFinalMode();

    // Stays on this final screen indefinitely without reloading or restarting
  }

});
