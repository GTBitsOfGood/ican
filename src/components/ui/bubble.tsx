interface BubbleProps {
  text?: string;
}

const Bubble: React.FC<BubbleProps> = ({ text = "Hey there! Don’t forget to take your medicine at 12:00!!" }) => {
  return (
    <div className="w-[43.75rem]">
      <div className="p-8 w-full bg-white shadow-[0px_8px_0px_0px_rgba(125,131,178,1.00)] text-4xl font-bold text-black text-center">
        {text}
      </div>
      <div className="h-10 w-10 ml-12">
        {/* Inline for now, I'm not really sure where to place the SVG */}
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_14396_364)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M40 0H0V40L40 0Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M40 0H0V40L40 0Z" fill="white" fill-opacity="0.16"/>
          </g>
          <defs>
          <filter id="filter0_d_14396_364" x="0" y="0" width="40" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="8"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.490196 0 0 0 0 0.513726 0 0 0 0 0.698039 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14396_364"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14396_364" result="shape"/>
          </filter>
          </defs>
        </svg>
      </div>
    </div>
  )
}

export default Bubble