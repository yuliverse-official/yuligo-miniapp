interface Iporps {
    size?: number;
    color?: string;
}
const ArrowRight: React.FC<Iporps> = (props) => {
    const { size = 16, color = "#ffffff" } = props;
    return (
        <svg
        width={size + 'px'}
        height={size + 'px'}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="antd-mobile-icon"
        style={{verticalAlign: '-0.125em'}}
        >
        <g
            id="RightOutline-RightOutline"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="RightOutline-RightOutlined">
            <rect
                id="RightOutline-矩形"
                fill={color}
                opacity="0"
                x="0"
                y="0"
                width="48"
                height="48"
            ></rect>
            <path
                d="M17.3947957,5.11219264 L35.5767382,22.6612572 L35.5767382,22.6612572 C36.1304785,23.2125856 36.1630514,24.0863155 35.6744571,24.6755735 L35.5767382,24.7825775 L17.3956061,42.8834676 C17.320643,42.9580998 17.2191697,43 17.1133896,43 L13.9866673,43 C13.7657534,43 13.5866673,42.8209139 13.5866673,42.6 C13.5866673,42.4936115 13.6290496,42.391606 13.7044413,42.316542 L32.3201933,23.7816937 L32.3201933,23.7816937 L13.7237117,5.6866816 C13.5653818,5.53262122 13.5619207,5.27937888 13.7159811,5.121049 C13.7912854,5.04365775 13.8946805,5 14.0026627,5 L17.1170064,5 C17.2206403,5 17.3202292,5.04022164 17.3947957,5.11219264 Z"
                id="RightOutline-right"
                fill="currentColor"
                fillRule="nonzero"
            ></path>
            </g>
        </g>
        </svg>
    );
};
export default ArrowRight;