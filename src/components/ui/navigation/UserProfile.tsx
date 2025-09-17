"use client"

import { Button } from "@/components/Button"
import { cx, focusRing } from "@/lib/utils"
import { RiMore2Fill } from "@remixicon/react"
import Image from "next/image"
import { useState } from "react"

import { DropdownUserProfile } from "./DropdownUserProfile"

export const UserProfileDesktop = () => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <DropdownUserProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          focusRing,
          "group flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span className="flex items-center gap-3">
          <span className="relative size-8 shrink-0">
            {!imageLoaded && !imageError && (
              <span className="absolute inset-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            )}
            {!imageError ? (
              <Image
                src="/images/profile.jpg"
                alt="Kenn Savvas"
                width={32}
                height={32}
                className={cx(
                  "rounded-full border border-gray-300 dark:border-gray-800",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <span
                className="flex size-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                aria-hidden="true"
              >
                KS
              </span>
            )}
          </span>
          <span>Kenn Savvas</span>
        </span>
        <RiMore2Fill
          className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
          aria-hidden="true"
        />
      </Button>
    </DropdownUserProfile>
  )
}

export const UserProfileMobile = () => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <DropdownUserProfile align="end">
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          "group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span className="relative size-7 shrink-0">
          {!imageLoaded && !imageError && (
            <span className="absolute inset-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          )}
          {!imageError ? (
            <Image
              src="/images/profile.jpg"
              alt="Kenn Savvas"
              width={28}
              height={28}
              className={cx(
                "rounded-full border border-gray-300 dark:border-gray-800",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <span
              className="flex size-7 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              aria-hidden="true"
            >
              KS
            </span>
          )}
        </span>
      </Button>
    </DropdownUserProfile>
  )
}