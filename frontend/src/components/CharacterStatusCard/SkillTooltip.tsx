import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const SkillTooltip = ({
  description,
  accentColor,
  children,
}: {
  description: string;
  accentColor: string;
  children: ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!show) {
      return;
    }

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [show]);

  return (
    <div className="skill-tooltip">
      <div
        ref={triggerRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((v) => !v)}
        className="skill-tooltip__trigger"
      >
        {children}
      </div>

      {show &&
        createPortal(
          <div
            className="skill-tooltip__panel"
            style={
              {
                "--tooltip-accent": accentColor,
                top: position.top,
                left: position.left,
              } as CSSProperties
            }
          >
            {description}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SkillTooltip;
