const ProfileFrame = () => {
  return (
    <>
      {/* Light Green Border Bottom-Aligned */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="-1 0 121 121"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M75.7317 10.7073H44.7439C25.9999 10.7073 10.8049 25.9023 10.8049 44.6463V77.1098C10.8049 95.8538 25.9999 111.049 44.7439 111.049H75.7317C94.4757 111.049 109.671 95.8538 109.671 77.1098V44.6463C109.671 25.9023 94.4757 10.7073 75.7317 10.7073ZM44.7439 0.378052C20.2952 0.378052 0.475586 20.1976 0.475586 44.6463V77.1098C0.475586 101.558 20.2952 121.378 44.7439 121.378H75.7317C100.18 121.378 120 101.558 120 77.1098V44.6463C120 20.1976 100.18 0.378052 75.7317 0.378052H44.7439Z"
          fill="url(#paint0_linear_13912_539)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_13912_539"
            x1="72.7805"
            y1="142.774"
            x2="59.5"
            y2="-7.7378"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#718E1F" />
            <stop offset="1" stopColor="#7CA13E" />
          </linearGradient>
        </defs>
      </svg>

      {/* Dark Green Border Top-Aligned */}
      <svg
        className="absolute top-0 w-full aspect-square"
        viewBox="0 0 121 121"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M75.2561 8.85366H44.2683C24.7093 8.85366 8.85366 24.7093 8.85366 44.2683V76.7317C8.85366 96.2907 31.941 112.146 51.5 112.146H75.2561C94.8151 112.146 110.671 96.2907 110.671 76.7317V44.2683C110.671 24.7093 94.815 8.85366 75.2561 8.85366ZM44.2683 0C19.8196 0 0 19.8196 0 44.2683V76.7317C0 101.18 19.8196 121 44.2683 121H75.2561C99.7048 121 119.524 101.18 119.524 76.7317V44.2683C119.524 19.8196 99.7048 0 75.2561 0H44.2683Z"
          fill="url(#paint0_linear_13912_540)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_13912_540"
            x1="59.0244"
            y1="60.5"
            x2="71.5671"
            y2="-19.9207"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38401E" />
            <stop offset="1" stopColor="#3A4222" />
          </linearGradient>
        </defs>
      </svg>

      {/* White Ellipse*/}
      <svg
        className="absolute top-[10%] left-[10%] w-[6.25%] h-auto"
        viewBox="0 0 8 9"
      >
        <ellipse
          cx="4.28753"
          cy="4.12375"
          rx="2.95122"
          ry="4.42683"
          transform="rotate(35.0528 4.28753 4.12375)"
          fill="#F3FFDB"
        />
      </svg>
    </>
  );
};

export default ProfileFrame;
