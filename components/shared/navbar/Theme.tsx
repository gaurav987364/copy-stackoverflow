"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { themes } from "@/constants";
import { useTheme } from "@/context/ThemeProvider"
import Image from "next/image";

const Theme = () => {
    const {mode, setMode} = useTheme();
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild className=" relative border-none bg-transparent shadow-none">
      {mode === "light" ? 
      <Image
        src='/assets/icons/sun.svg'
        alt="sun" 
        width={20} 
        height={20} 
        className="active-theme"/> : 
      <Image 
        src='/assets/icons/moon.svg' 
        alt="moon" 
        width={20} 
        height={20} 
        className="active-theme"
       />}
    </DropdownMenuTrigger>
    <DropdownMenuContent className=" absolute -right-12 mt-3 min-w-[120px] cursor-pointer rounded border bg-light-900 py-2 focus:bg-light-800 dark:border-dark-400 dark:bg-dark-300 dark:focus:bg-dark-400">
      <>
        {themes.map(theme => (
            <DropdownMenuItem key={theme.label} onClick={()=> {
                setMode(theme.value)
                if(theme.value !== 'system') {
                    localStorage.theme = theme.value
                } else {
                    localStorage.removeItem('theme')
                }
         }} className=" flex items-center gap-4 p-2 dark:focus:bg-dark-400">
                <Image 
                src={theme.icon} 
                alt={theme.value} 
                width={16} 
                height={16} 
                className={`${mode === theme.value && 'active-theme'}`}
                />
                <span className={`${mode === theme.value ? 'text-primary-500' : 'text-dark100_light900'}`}>{theme.label}</span>
            </DropdownMenuItem>
        ))}
      </>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default Theme