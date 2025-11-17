import React, { useEffect, useRef } from 'react';

const FuzzyText = ({
  children,
  fontSize = 'clamp(2rem, 10vw, 10rem)',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '#fff',
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  ...props
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      if (isCancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const text = React.Children.toArray(children).join('');

      const temp = document.createElement('span');
      temp.style.fontSize =
        typeof fontSize === 'number' ? fontSize + 'px' : fontSize;
      temp.style.fontWeight = fontWeight;
      temp.style.fontFamily =
        fontFamily === 'inherit'
          ? window.getComputedStyle(canvas).fontFamily
          : fontFamily;
      temp.style.position = 'absolute';
      temp.style.whiteSpace = 'nowrap';
      temp.style.visibility = 'hidden';
      temp.textContent = text;

      document.body.appendChild(temp);

      const rect = temp.getBoundingClientRect();
      const textWidth = Math.ceil(rect.width);
      const textHeight = Math.ceil(rect.height);

      const computedFontSize = parseFloat(
        window.getComputedStyle(temp).fontSize
      );
      document.body.removeChild(temp);

      canvas.width = textWidth;
      canvas.height = textHeight;
      canvas.style.width = textWidth + 'px';
      canvas.style.height = textHeight + 'px';

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      offscreen.width = textWidth;
      offscreen.height = textHeight;

      const finalFontFamily =
        fontFamily === 'inherit'
          ? window.getComputedStyle(canvas).fontFamily
          : fontFamily;

      offCtx.font = `${fontWeight} ${computedFontSize}px ${finalFontFamily}`;
      offCtx.textBaseline = 'top';
      offCtx.fillStyle = color;
      offCtx.fillText(text, 0, 0);

      let isHovering = false;
      const fuzzRange = 30;

      const run = () => {
        if (isCancelled) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const intensity = isHovering ? hoverIntensity : baseIntensity;

        for (let y = 0; y < textHeight; y++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(offscreen, 0, y, textWidth, 1, dx, y, textWidth, 1);
        }

        animationFrameId = requestAnimationFrame(run);
      };

      run();

      const handleMove = (x, y) => {
        if (!enableHover) return;
        isHovering = x >= 0 && x <= textWidth && y >= 0 && y <= textHeight;
      };

      const onMouseMove = (e) => {
        const r = canvas.getBoundingClientRect();
        handleMove(e.clientX - r.left, e.clientY - r.top);
      };

      const onTouchMove = (e) => {
        if (!enableHover) return;
        e.preventDefault();
        const t = e.touches[0];
        const r = canvas.getBoundingClientRect();
        handleMove(t.clientX - r.left, t.clientY - r.top);
      };

      const onLeave = () => (isHovering = false);

      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onLeave);
      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      canvas.addEventListener('touchend', onLeave);

      canvas.cleanupFuzzyText = () => {
        cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onLeave);
        canvas.removeEventListener('touchmove', onTouchMove);
        canvas.removeEventListener('touchend', onLeave);
      };
    };

    init();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      if (canvas?.cleanupFuzzyText) canvas.cleanupFuzzyText();
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
  ]);

  return (
    <canvas ref={canvasRef} style={{ display: 'inline-block' }} {...props} />
  );
};

export default FuzzyText;
