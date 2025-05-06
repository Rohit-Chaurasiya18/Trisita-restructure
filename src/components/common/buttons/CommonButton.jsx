const CommonButton = ({
  children,
  className,
  type = "button",
  onClick,
  style,
  isDisabled,
  ...args
}) => {
  return (
    <button
      type={type}
      style={style}
      className={`${"common-btn "} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...args}
    >
      {children}
    </button>
  );
};

export default CommonButton;
