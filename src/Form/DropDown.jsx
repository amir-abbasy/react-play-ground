import React, { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge';


{/* <DropDown
  title="Chhose crypto token"
  data={options.data}
  value={options.value}
  placeholder="Select Currency"
  onSelect={(value) => setOpstion(_ => ({ ..._, value }))}
  renderItem={(item) => <div>
      <p className='text-2xl'>{item.title}</p>
      <p className='text'>$0.33</p>
    </div>}
  classNameContainer="mt-4"
/> */}



const DropDown = ({
  input,
  title,
  data,
  className,
  value,
  placeholder = "Select",
  onSelect, renderItem,
  classNameContainer,
  ClassNameTitle,
  disabled,
  rightComponent,
  picker = null,
  header,
  footer
}) => {

  const [isOpen, setOpen] = useState(false)
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  return <div className={twMerge(`relative ${disabled ? 'opacity-40' : ''}`, classNameContainer)} ref={wrapperRef}>
    {/* <input  {...input} className='hidden' value={input.value} /> */}
    {/* custom picker */}
    {picker ? <div onClick={() => !disabled && setOpen(!isOpen)}>{picker?.()}</div> :
      <>
        {title && <p className={ClassNameTitle}>{title}</p>}
        <div className={twMerge(`bg-[#cccccc20] flex justify-between items-center p-3 my-2 outline-none rounded-lg text-black text-lg placeholder:text-primary`, className)}
          onClick={() => !disabled && setOpen(!isOpen)}>
          <div className="flex gap-1">

            {data?.find((item) => item.value == value)?.icon && <img
              className="rounded-2xl w-6 h-6 mx-2"
              src={data?.find((item) => item.value == value)?.icon}
            />}
            <p className="mr-2">{data?.find((item) => item.value == value)?.title ?? placeholder}</p>
          </div>
          {/* <span translate="no" className="material-symbols-rounded">
            {isOpen ? 'keyboard_arrow_up' : 'expand_more'}
          </span> */}
        </div>
      </>
    }



    {isOpen && <div className="drop-down absolute bg-white text-black left-0  w-full rounded-md shadow-lg ring-0 black ring-opacity-5 focus:outline-none text-textColor z-[900]  max-h-[40vh] overflow-y-scroll" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
      {header && header?.()}

      {data?.map((item, key) => {
        if (item?.hide) return
        return <a
          className={`drop-down-child px-4 py-2 text-sm flex  hover:bg-[#f8f9fa] justify-between items-center cursor-pointer ${value == key ? 'bg-[#9A718B20]' : 'border-b border-[#9A718B20]'}`} role="menuitem"
          onClick={() => {
            input.onChange(item.value)
            onSelect(item.value)
            setOpen(false)
          }}
          key={"menuitem_" + key}
          style={{
            animationDelay: `${key * 0.05}s`
          }}
        >
          {item.value == value && <span className='text-2xl text-primary absolute left-2'>•</span>}
          <div className='flex items-center'>
            {item?.icon && <img
              className="rounded-2xl w-6 h-6 mx-2"
              src={item.icon}
            />}
            {renderItem?.(item) ?? <span>{item.title}</span>}
          </div>
          {rightComponent?.(item, key)}
        </a>
      })}
    </div>
    }
    {footer && footer?.()}

  </div>
}
export default DropDown
