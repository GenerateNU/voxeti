import { ReactNode } from "react"

type GridItemProps = {
  title: string
  children: ReactNode
}

const GridItem = ({ title, children } : GridItemProps) => {
  return (
    <div className='text-[#A4A4A4]'>
      <h1 className='font-semibold text-lg text-primary mb-2'>
        {title}
      </h1>
      {children}
    </div>
  )
}

export { GridItem }
