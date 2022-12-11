import classNames from 'classnames';
import './import-svg';
import './style.scss';

type Props = {
  name: string;
  color?: string;
  style?: React.CSSProperties;
};

const SvgIcon = ({ style, color, name }: Props) => {
  const _style = {
    ...style,
    color,
  };

  return (
    <svg style={_style} className={classNames(['svg-icon'])}>
      <use xlinkHref={'#icon-' + name}></use>
    </svg>
  );
};

export default SvgIcon;
