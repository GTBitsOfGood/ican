const FeedButton = ({}) => {
  return (
    <button
      className="w-[16.5rem] h-[7.5rem] relative cursor-pointer border-none bg-transparent p-0"
      type="button"
    >
      <div
        className="w-full h-full left-0 top-0 absolute bg-gradient-to-b 
        from-[#accc6e] via-[#7b9449] to-[#365914] 
        shadow-button-outer
        border-4 border-[#1a2107]/40 flex justify-center items-center"
      >
        <div
          className="w-[91.5%] h-[86.5%] bg-gradient-to-b from-[#accc6e] to-[#739935] 
          shadow-inner border-4 border-t-0 border-[#b7c982]/40"
        >
          <div className="h-full w-full flex justify-center items-center">
            <span className="font-quantico text-center text-white text-6xl font-bold leading-9 text-shadow-blue"> FEED </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default FeedButton