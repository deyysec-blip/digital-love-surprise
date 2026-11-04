/**
 * ===================================================================
 * DIGITAL LOVE — A HEART MADE OF WORDS
 * Canvas Word-Heart Engine for AA FAJAR MAULANA YUSUF ❤️
 * ===================================================================
 */

(function (window) {
  'use strict';

  // Words forming the heart (as specified: "I LOVE YOU", "LOVE YOU", and "FOREVER")
  const WORDS = ["I LOVE YOU", "LOVE YOU", "FOREVER"];

  // Ambient Floating Typography Words (for empty space around the heart)
  const AMBIENT_WORDS_LIST = [
    "I LOVE YOU", "LOVE YOU", "FOREVER", "I LOVE YOU FOREVER", "♥",
    "I LOVE YOU", "LOVE YOU", "♥", "FOREVER", "I LOVE YOU", "♥"
  ];

  // Harmonious Blue Palette with Clear Hierarchy:
  // - Majority (78%): Deep Navy Blue & Medium Blue (sharp, readable, no visual glare)
  // - Highlight (14%): Electric Blue (adds energy & definition)
  // - Accent (5%): Cyan (sparingly used for jewel-like accents)
  // - Highlight (3%): Bluish White (rare twinkle accents)
  function getHarmoniousParticleColor() {
    const rand = Math.random();
    if (rand < 0.44) {
      // 44% Biru Tua (Deep Royal / Navy Blue) - crisp zero-blur text
      const fills = ['#1d4ed8', '#1e40af', '#1e3a8a', '#2563eb'];
      const fill = fills[Math.floor(Math.random() * fills.length)];
      return {
        fill: fill,
        glow: 'rgba(29, 78, 216, 0.2)',
        shadowBlur: 0, // Sharp text, zero glare
        alpha: 0.82
      };
    } else if (rand < 0.78) {
      // 34% Biru Sedang (Medium Cobalt / Slate Blue) - minimal soft illumination
      const fills = ['#3b82f6', '#0284c7', '#0369a1'];
      const fill = fills[Math.floor(Math.random() * fills.length)];
      return {
        fill: fill,
        glow: 'rgba(59, 130, 246, 0.3)',
        shadowBlur: 2,
        alpha: 0.88
      };
    } else if (rand < 0.92) {
      // 14% Biru Elektrik (Electric Blue Highlight) - soft controlled glow
      const fills = ['#0099ff', '#38bdf8', '#0ea5e9'];
      const fill = fills[Math.floor(Math.random() * fills.length)];
      return {
        fill: fill,
        glow: 'rgba(0, 153, 255, 0.5)',
        shadowBlur: 3.5,
        alpha: 0.92
      };
    } else if (rand < 0.97) {
      // 5% Cyan (Aksen) - jewel-like accent
      const fills = ['#00e5ff', '#06b6d4'];
      const fill = fills[Math.floor(Math.random() * fills.length)];
      return {
        fill: fill,
        glow: 'rgba(0, 229, 255, 0.45)',
        shadowBlur: 4,
        alpha: 0.94
      };
    } else {
      // 3% Putih Kebiruan (Highlight) - rare subtle twinkle
      return {
        fill: '#e0f2fe',
        glow: 'rgba(224, 242, 254, 0.6)',
        shadowBlur: 4,
        alpha: 0.96
      };
    }
  }

  // Floating Ambient Typography Color Generator (Soft, Varied Depth, Non-intrusive)
  function getHarmoniousAmbientColor() {
    const rand = Math.random();
    if (rand < 0.45) {
      // 45% Biru Tua (Deep subtle blue - background depth)
      const fills = ['#1e40af', '#1d4ed8', '#1e3a8a', '#2563eb'];
      return {
        fill: fills[Math.floor(Math.random() * fills.length)],
        glow: 'rgba(30, 64, 175, 0.2)',
        shadowBlur: 0,
        baseAlpha: 0.22 + Math.random() * 0.20 // 0.22 - 0.42 (distant, soft)
      };
    } else if (rand < 0.78) {
      // 33% Biru Sedang / Elektrik (Medium vibrant blue)
      const fills = ['#3b82f6', '#0284c7', '#0ea5e9'];
      return {
        fill: fills[Math.floor(Math.random() * fills.length)],
        glow: 'rgba(59, 130, 246, 0.3)',
        shadowBlur: 1.5,
        baseAlpha: 0.35 + Math.random() * 0.24 // 0.35 - 0.59
      };
    } else if (rand < 0.93) {
      // 15% Cyan / Biru Muda (Clear gentle highlights)
      const fills = ['#06b6d4', '#38bdf8', '#00e5ff'];
      return {
        fill: fills[Math.floor(Math.random() * fills.length)],
        glow: 'rgba(0, 229, 255, 0.4)',
        shadowBlur: 2.5,
        baseAlpha: 0.42 + Math.random() * 0.18 // 0.42 - 0.60
      };
    } else {
      // 7% Putih Kebiruan (Soft twinkle)
      return {
        fill: '#e0f2fe',
        glow: 'rgba(224, 242, 254, 0.5)',
        shadowBlur: 3,
        baseAlpha: 0.50 + Math.random() * 0.18 // 0.50 - 0.68
      };
    }
  }

  class WordHeartEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance

      this.particles = [];
      this.sparkles = [];
      this.ambientWords = [];
      this.state = 'IDLE'; // 'IDLE', 'GATHERING', 'BEATING', 'FOCUS'
      this.gatherStartTime = 0;
      this.width = 0;
      this.height = 0;
      this.centerX = 0;
      this.centerY = 0;
      this.heartScale = 1;
      this.globalPulse = 1;
      this.focusDimFactor = 1.0; // Dim or scale during letter reading
      this.hologramScanY = 0;
      this.isFinalMode = false;
      this.finalFadeStart = 0;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.createParticles();
      this.createSparkles();
      this.createAmbientWords();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width || window.innerWidth;
      this.height = rect.height || window.innerHeight;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);

      this.centerX = this.width / 2;
      this.centerY = this.height / 2;

      // Responsive large heart base scale
      // Width is 32 units, centered height is ~28.7 units
      const isPortrait = this.height > this.width;
      if (isPortrait) {
        // Mobile 9:16 layout: prominent large heart
        this.baseHeartScale = (this.width * 0.86) / 32;
      } else {
        // Desktop widescreen layout
        this.baseHeartScale = (Math.min(this.width, this.height) * 0.76) / 32;
      }

      if (this.particles.length > 0) {
        this.updateTargets();
      }
      if (this.ambientWords && this.ambientWords.length > 0) {
        this.createAmbientWords();
      }
    }

    /**
     * Parametric Heart Equation:
     * x(t) = 16 * sin^3(t)
     * y(t) = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
     * Precisely centered vertically so top lobes and bottom tip are equidistant from origin (0,0)
     */
    getHeartPoint(t, radiusScale = 1.0) {
      const sinT = Math.sin(t);
      const x = 16 * Math.pow(sinT, 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      // Subtracting 2.65 centers the heart vertically: top lobes ≈ -14.35, bottom tip = +14.35
      return {
        x: x * radiusScale,
        y: (y - 2.65) * radiusScale
      };
    }

    createParticles() {
      this.particles = [];
      const isMobile = this.width < 600;

      // Concentric rings forming a dense, structured heart without text clumping:
      // Rings from outer perimeter inwards, leaving center (r < 0.32) clear for "I Love You"
      const rings = [
        { r: 1.00, countMobile: 56, countDesktop: 72, isContour: true },  // Outer contour
        { r: 0.90, countMobile: 48, countDesktop: 62, isContour: true },  // Secondary contour
        { r: 0.80, countMobile: 42, countDesktop: 54, isContour: false }, // Outer shell
        { r: 0.69, countMobile: 36, countDesktop: 46, isContour: false }, // Mid shell
        { r: 0.57, countMobile: 30, countDesktop: 38, isContour: false }, // Inner-mid shell
        { r: 0.45, countMobile: 24, countDesktop: 30, isContour: false }, // Inner shell
        { r: 0.33, countMobile: 16, countDesktop: 22, isContour: false }, // Center boundary ring
      ];

      for (let ringIdx = 0; ringIdx < rings.length; ringIdx++) {
        const ring = rings[ringIdx];
        const count = isMobile ? ring.countMobile : ring.countDesktop;
        const phaseOffset = ringIdx * 0.14; // Staggered brick-like spacing

        for (let i = 0; i < count; i++) {
          // Even angular distribution around parameter t in [-PI, PI]
          const tFrac = i / count;
          const t = -Math.PI + tFrac * Math.PI * 2 + phaseOffset + (Math.random() - 0.5) * 0.04;
          const r = ring.r + (Math.random() - 0.5) * 0.035;

          const point = this.getHeartPoint(t, r);
          const colorObj = getHarmoniousParticleColor();

          // Tangent alignment along perimeter for crisp heart contour; gentle tilt inside
          let angle;
          if (ring.isContour) {
            const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
            const dy = 13 * Math.sin(t) - 10 * Math.sin(2 * t) - 6 * Math.sin(3 * t) - 4 * Math.sin(4 * t);
            let tanAngle = Math.atan2(dy, dx);
            if (Math.abs(tanAngle) > Math.PI / 2) {
              tanAngle -= Math.sign(tanAngle) * Math.PI; // Keep text upright
            }
            angle = tanAngle + (Math.random() - 0.5) * 0.08;
          } else {
            angle = (Math.random() - 0.5) * 0.08; // Gentle horizontal tilt
          }

          // Varied font sizes: 8.5px to 11.5px
          const baseFontSize = isMobile 
            ? (8.5 + (ring.isContour ? 0 : Math.random() * 2.5)) 
            : (10.0 + (ring.isContour ? 0 : Math.random() * 3.0));

          const startX = Math.random() * this.width;
          const startY = Math.random() * this.height;

          this.particles.push({
            text: WORDS[Math.floor(Math.random() * WORDS.length)],
            color: colorObj.fill,
            glow: colorObj.glow,
            shadowBlur: colorObj.shadowBlur,
            fontSize: baseFontSize,

            normX: point.x,
            normY: point.y,
            tParam: t,
            radiusScale: r,

            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,

            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.7 + Math.random() * 1.3,
            swayRadius: 0.8 + Math.random() * 1.8,

            gatherDelay: Math.random() * 1.5,
            gatherProgress: 0,
            startX: startX,
            startY: startY,

            alpha: colorObj.alpha,
            baseAlpha: colorObj.alpha,
            angle: angle
          });
        }
      }

      // Additional volumetric fill particles in the upper lobes (where heart width is largest)
      const lobeFillCount = isMobile ? 32 : 50;
      for (let j = 0; j < lobeFillCount; j++) {
        // Lobe angles: left lobe [-2.4, -0.7], right lobe [0.7, 2.4]
        const isRight = Math.random() > 0.5;
        const tLobe = isRight 
          ? (0.75 + Math.random() * 1.6) 
          : (-0.75 - Math.random() * 1.6);
        const rLobe = 0.48 + Math.random() * 0.38;

        const point = this.getHeartPoint(tLobe, rLobe);
        const colorObj = getHarmoniousParticleColor();
        const startX = Math.random() * this.width;
        const startY = Math.random() * this.height;

        this.particles.push({
          text: WORDS[Math.floor(Math.random() * WORDS.length)],
          color: colorObj.fill,
          glow: colorObj.glow,
          shadowBlur: colorObj.shadowBlur,
          fontSize: isMobile ? (8.5 + Math.random() * 2.5) : (10.0 + Math.random() * 2.5),

          normX: point.x,
          normY: point.y,
          tParam: tLobe,
          radiusScale: rLobe,

          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,

          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.7 + Math.random() * 1.3,
          swayRadius: 0.8 + Math.random() * 1.8,

          gatherDelay: Math.random() * 1.5,
          gatherProgress: 0,
          startX: startX,
          startY: startY,

          alpha: colorObj.alpha,
          baseAlpha: colorObj.alpha,
          angle: (Math.random() - 0.5) * 0.08
        });
      }
    }

    createSparkles() {
      this.sparkles = [];
      const count = this.width < 600 ? 50 : 85;
      for (let i = 0; i < count; i++) {
        const randCol = Math.random();
        let col;
        if (randCol < 0.45) col = '#38bdf8';     // soft blue
        else if (randCol < 0.75) col = '#1d4ed8'; // deep blue
        else col = '#e0f2fe';                    // bluish white

        this.sparkles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 1.4 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.5 - 0.15, // Drifting upwards
          alpha: Math.random() * 0.65 + 0.2,
          pulseSpeed: 1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          color: col
        });
      }
    }

    /**
     * Test whether a point (x, y) is inside the heart footprint (with margin)
     * Used to keep the area inside the heart clear of floating typography
     */
    isInsideHeartFootprint(x, y, margin = 1.15) {
      const heartHalfW = this.baseHeartScale * 16.0 * margin;
      const heartHalfH = this.baseHeartScale * 14.5 * margin;
      const nx = (x - this.centerX) / heartHalfW;
      const ny = (y - this.centerY) / heartHalfH;
      return (nx * nx + ny * ny) < 1.0;
    }

    /**
     * Floating typography in the empty space around the heart
     * Fills left, right, top, and bottom with romantic typography particles
     */
    createAmbientWords() {
      this.ambientWords = [];
      const isMobile = this.width < 600;
      // 65 on mobile, 115 on desktop
      const count = isMobile ? 65 : 115;

      const heartHalfW = this.baseHeartScale * 16.0 * 1.15;
      const heartHalfH = this.baseHeartScale * 14.5 * 1.15;

      for (let i = 0; i < count; i++) {
        const text = AMBIENT_WORDS_LIST[Math.floor(Math.random() * AMBIENT_WORDS_LIST.length)];
        const colorObj = getHarmoniousAmbientColor();

        // 42% left flank, 42% right flank, 8% top, 8% bottom
        const zone = Math.random();
        let x, y;

        if (zone < 0.42) {
          // Left flank
          const maxX = Math.max(20, this.centerX - heartHalfW * 0.70);
          x = Math.random() * maxX;
          y = Math.random() * this.height;
        } else if (zone < 0.84) {
          // Right flank
          const minX = Math.min(this.width - 20, this.centerX + heartHalfW * 0.70);
          x = minX + Math.random() * (this.width - minX);
          y = Math.random() * this.height;
        } else if (zone < 0.92) {
          // Top margin
          x = Math.random() * this.width;
          const maxY = Math.max(20, this.centerY - heartHalfH * 0.85);
          y = Math.random() * maxY;
        } else {
          // Bottom margin
          x = Math.random() * this.width;
          const minY = Math.min(this.height - 20, this.centerY + heartHalfH * 0.85);
          y = minY + Math.random() * (this.height - minY);
        }

        // Safety check: push outside if touching heart boundary
        if (this.isInsideHeartFootprint(x, y)) {
          if (x < this.centerX) {
            x = Math.random() * Math.max(25, this.centerX - heartHalfW);
          } else {
            x = Math.min(this.width - 25, this.centerX + heartHalfW) + Math.random() * 40;
          }
        }

        // Varied font sizes: very small to medium
        const isHeartSymbol = text === "♥";
        let fontSize;
        if (isHeartSymbol) {
          fontSize = isMobile ? (7.5 + Math.random() * 3.5) : (9.0 + Math.random() * 4.5);
        } else if (text === "I LOVE YOU FOREVER") {
          fontSize = isMobile ? (6.5 + Math.random() * 2.0) : (8.0 + Math.random() * 2.5);
        } else {
          fontSize = isMobile ? (7.0 + Math.random() * 3.5) : (8.5 + Math.random() * 4.0);
        }

        this.ambientWords.push({
          text: text,
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -Math.random() * 0.32 - 0.08, // Slow upward float
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.6 + Math.random() * 1.2,
          swayRadius: 1.2 + Math.random() * 3.0,
          pulseSpeed: 0.8 + Math.random() * 1.4,
          angle: (Math.random() - 0.5) * 0.20,
          fontSize: fontSize,
          color: colorObj.fill,
          glow: colorObj.glow,
          shadowBlur: colorObj.shadowBlur,
          baseAlpha: colorObj.baseAlpha
        });
      }
    }

    renderAmbientWords(timeSec) {
      const ctx = this.ctx;
      const heartHalfW = this.baseHeartScale * 16.0 * 1.15;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < this.ambientWords.length; i++) {
        const p = this.ambientWords[i];

        // Float motion
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.y < -30) {
          p.y = this.height + 25;
          p.x = Math.random() * this.width;
        }
        if (p.y > this.height + 35) {
          p.y = -25;
          p.x = Math.random() * this.width;
        }
        if (p.x < -40) p.x = this.width + 30;
        if (p.x > this.width + 40) p.x = -30;

        // Repel from heart footprint while drifting
        if (this.isInsideHeartFootprint(p.x, p.y)) {
          if (p.x < this.centerX) {
            p.x -= 0.7;
          } else {
            p.x += 0.7;
          }
        }

        // Gentle floating sway
        const swayX = Math.sin(timeSec * p.swaySpeed + p.swayPhase) * p.swayRadius;
        const swayY = Math.cos(timeSec * p.swaySpeed * 0.8 + p.swayPhase) * (p.swayRadius * 0.4);

        // Gentle opacity pulsing
        const pulse = Math.sin(timeSec * p.pulseSpeed + p.swayPhase) * 0.12;
        const alpha = Math.max(0.08, Math.min(0.72, (p.baseAlpha + pulse) * this.focusDimFactor));

        ctx.save();
        ctx.translate(p.x + swayX, p.y + swayY);
        ctx.rotate(p.angle);

        ctx.font = `600 ${p.fontSize}px 'JetBrains Mono', 'Consolas', monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;

        if (p.shadowBlur > 0) {
          ctx.shadowColor = p.glow;
          ctx.shadowBlur = p.shadowBlur;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      }

      ctx.restore();
    }

    updateTargets() {
      // Re-evaluate responsive targets on resize
    }

    setFinalMode() {
      this.state = 'BEATING';
      this.focusDimFactor = 1.0;
      this.isFinalMode = true;
      this.finalFadeStart = performance.now();
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;

      // In the ending animation, heart is formed of many small "I LOVE YOU" texts
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].text = "I LOVE YOU";
      }
    }

    setFocusMode(dim) {
      if (this.isFinalMode) {
        this.focusDimFactor = 1.0;
        return;
      }
      this.focusDimFactor = dim ? 0.68 : 1.0;
    }

    /**
     * Double-thump human heartbeat function:
     * lub-dub pulse rhythm (~50 bpm, relaxing, romantic)
     */
    getHeartbeat(timeSec) {
      const period = 1.25; // seconds per full beat cycle
      const cycle = (timeSec % period) / period;

      if (cycle < 0.12) {
        // Primary 'lub' pump
        return Math.sin((cycle / 0.12) * Math.PI) * 0.085;
      } else if (cycle >= 0.16 && cycle < 0.28) {
        // Secondary 'dub' pump
        return Math.sin(((cycle - 0.16) / 0.12) * Math.PI) * 0.045;
      }
      return 0;
    }

    startGathering() {
      this.state = 'GATHERING';
      this.gatherStartTime = performance.now();
      // Record actual positions when transition begins
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.startX = p.x;
        p.startY = p.y;
      }
    }

    animate(now) {
      requestAnimationFrame(this.animate);

      const timeSec = now / 1000;
      const ctx = this.ctx;

      // Soft clear with slight trail for motion glow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, this.width, this.height);

      // Render floating ambient sparkles
      this.renderSparkles(timeSec);

      // Render floating ambient typography around the heart
      this.renderAmbientWords(timeSec);

      // Calculate current heartbeat scale
      const beatOffset = this.getHeartbeat(timeSec);
      this.globalPulse = 1 + beatOffset;

      const currentScale = this.baseHeartScale * this.globalPulse * (this.focusDimFactor < 1 ? 0.92 : 1.0);

      // Hologram scanline wave
      this.hologramScanY = (this.hologramScanY + 1.2) % (this.height + 100);
      this.renderHologramBeam();

      // Render Word Particles
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const isGathering = this.state === 'GATHERING';
      const elapsedSinceGather = (now - this.gatherStartTime) / 1000;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Target pixel position on the screen
        const targetX = this.centerX + p.normX * currentScale;
        const targetY = this.centerY + p.normY * currentScale;

        // Sway offset for natural organic breathing
        const swayX = Math.sin(timeSec * p.swaySpeed + p.swayPhase) * p.swayRadius;
        const swayY = Math.cos(timeSec * p.swaySpeed + p.swayPhase) * p.swayRadius;

        if (this.state === 'IDLE') {
          // Slowly wander in space
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -40) p.x = this.width + 40;
          if (p.x > this.width + 40) p.x = -40;
          if (p.y < -40) p.y = this.height + 40;
          if (p.y > this.height + 40) p.y = -40;

          // Gentle ambient opacity
          p.alpha = 0.25 + Math.sin(timeSec * 1.5 + p.swayPhase) * 0.15;

        } else if (isGathering) {
          // Staggered smooth arrival
          const localTime = Math.max(0, elapsedSinceGather - p.gatherDelay);
          const duration = 2.4; // 2.4 seconds to reach destination
          let progress = Math.min(1, localTime / duration);

          // Smooth cubic-out easing
          const easeOut = 1 - Math.pow(1 - progress, 3);

          p.x = p.startX + (targetX + swayX - p.startX) * easeOut;
          p.y = p.startY + (targetY + swayY - p.startY) * easeOut;

          // Increase brightness as it joins the heart
          p.alpha = 0.25 + easeOut * (p.baseAlpha - 0.25);

          if (elapsedSinceGather > 3.8 && this.state === 'GATHERING') {
            this.state = 'BEATING';
          }

        } else {
          // Fully formed heart: follow heartbeat + gentle organic sway
          // High responsiveness to stay tight with heartbeat
          p.x += (targetX + swayX - p.x) * 0.15;
          p.y += (targetY + swayY - p.y) * 0.15;

          // Pulse opacity subtly in rhythm with heartbeat
          p.alpha = (p.baseAlpha + beatOffset * 2.5) * this.focusDimFactor;
        }

        // Draw the text particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.font = `600 ${p.fontSize}px 'JetBrains Mono', 'Consolas', monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.18, Math.min(1, p.alpha * this.focusDimFactor));

        // Soft controlled glow: 0 for deep blue (crisp), 2 for medium, 3.5-4 for highlights
        if (p.shadowBlur > 0) {
          ctx.shadowColor = p.glow;
          ctx.shadowBlur = p.shadowBlur;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      }

      ctx.restore();

      // Render Ending Centerpiece "I Love You" in the center of the heart
      if (this.isFinalMode) {
        this.renderEndingCenterpiece(now, timeSec, beatOffset);
      }
    }

    renderEndingCenterpiece(now, timeSec, beatOffset) {
      const ctx = this.ctx;
      
      // Calculate smooth fade-in progress (0 to 1 over 1.4s)
      const elapsed = (now - this.finalFadeStart) / 1000;
      const progress = Math.min(1, Math.max(0, elapsed / 1.4));
      // Ease out cubic
      const fadeAlpha = 1 - Math.pow(1 - progress, 3);
      if (fadeAlpha <= 0.01) return;

      ctx.save();
      ctx.translate(this.centerX, this.centerY);

      // Subtle heartbeat pulse + gentle floating motion
      const centerPulse = 1 + beatOffset * 1.15;
      const floatY = Math.sin(timeSec * 1.5) * 2;
      const totalScale = centerPulse * (0.95 + 0.05 * fadeAlpha);
      ctx.scale(totalScale, totalScale);

      // Responsive font size for the centerpiece (elegant, large, and readable)
      const isMobile = this.width < 600;
      const titleFontSize = isMobile 
        ? Math.round(Math.min(48, Math.max(34, this.width * 0.105)))
        : Math.round(Math.min(68, Math.max(46, this.height * 0.082)));

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Classic upright serif font (tegak & elegan - NO ITALIC)
      ctx.font = `600 ${titleFontSize}px 'Playfair Display', 'Cinzel', Georgia, serif`;

      // Soft blue neon under-glow (subtle, elegant, not blinding)
      ctx.shadowColor = 'rgba(0, 153, 255, 0.65)';
      ctx.shadowBlur = 10;

      // Pure bluish-white fill
      ctx.fillStyle = `rgba(240, 249, 255, ${fadeAlpha})`;
      ctx.fillText('I Love You', 0, floatY);

      // Second crisp pass to reinforce sharp letterforms (no blur)
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.92 * fadeAlpha})`;
      ctx.fillText('I Love You', 0, floatY);

      ctx.restore();
    }

    renderSparkles(timeSec) {
      const ctx = this.ctx;
      ctx.save();
      for (let i = 0; i < this.sparkles.length; i++) {
        const s = this.sparkles[i];
        s.y += s.vy;
        s.x += s.vx;

        // Wrap around vertically
        if (s.y < -10) {
          s.y = this.height + 10;
          s.x = Math.random() * this.width;
        }
        if (s.x < 0) s.x = this.width;
        if (s.x > this.width) s.x = 0;

        const pulse = Math.sin(timeSec * s.pulseSpeed + s.phase);
        const alpha = Math.max(0.1, s.alpha + pulse * 0.3) * this.focusDimFactor;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 3;
        ctx.fill();
      }
      ctx.restore();
    }

    renderHologramBeam() {
      // Subtle glowing light scan passing through
      const ctx = this.ctx;
      ctx.save();
      const grad = ctx.createLinearGradient(0, this.hologramScanY - 60, 0, this.hologramScanY + 60);
      grad.addColorStop(0, 'rgba(0, 243, 255, 0)');
      grad.addColorStop(0.5, 'rgba(0, 243, 255, 0.025)');
      grad.addColorStop(1, 'rgba(0, 243, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, this.hologramScanY - 60, this.width, 120);
      ctx.restore();
    }
  }

  // Expose engine to global window
  window.WordHeartEngine = WordHeartEngine;

})(window);
