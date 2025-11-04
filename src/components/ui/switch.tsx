// "use client"

// import * as React from "react"
// import * as SwitchPrimitive from "@radix-ui/react-switch"

// import { cn } from "@/lib/utils"

// function Switch({
//   className,
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
//   return (
//     <SwitchPrimitive.Root
//       data-slot="switch"
//       className={cn(
//         "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <SwitchPrimitive.Thumb
//         data-slot="switch-thumb"
//         className={cn(
//           "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
//         )}
//       />
//     </SwitchPrimitive.Root>
//   )
// }

// export { Switch }
"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        // Default grey → Active green
        "data-[state=checked]:bg-accent data-[state=unchecked]:bg-gray-300",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
          "data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

