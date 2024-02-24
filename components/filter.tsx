import { TActionsDropdown, TActionsDropdownItem, TActionsItem, TActionsItemWrapper } from "@/styles/filter";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

export interface TFilterOptions {
  label: string;
  slug: string;
  selected: string | number;
  options: {
    [label: string | number]: string | number
  }
}

export function TableFilters({
  menuOptions,
}: {
  menuOptions: TFilterOptions[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // const paginationParams = getPaginationParams(searchParams)
  // const queryParams = getQueryParams(paginationParams, searchParams)

  const [activeDropdownMenu, setActiveDropdownMenu] = useState<string>("");

  const handleDropdownMenu = (slug: string) => {
    if (activeDropdownMenu == slug) {
      setActiveDropdownMenu("");
    } else {
      setActiveDropdownMenu(slug);
    }
  }

  // close dropdown menu when changing filter
  useEffect(() => {
    setActiveDropdownMenu("")
  }, [searchParams])

  // close dropdown menu when clicking outside
  const dropdownMenuItemsRef = useRef<{
    [key: string]: HTMLDivElement;
  }>({});

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        activeDropdownMenu != "" &&
        dropdownMenuItemsRef.current[activeDropdownMenu] &&
        event.target instanceof Node &&
        !dropdownMenuItemsRef.current[activeDropdownMenu].contains(event.target)
      ) {
        setActiveDropdownMenu("")
      }
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("touchend", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("touchend", handleClick)
    }
  }, [activeDropdownMenu, dropdownMenuItemsRef])

  return (
    <>
      {menuOptions.map((item) => (
        <TActionsItemWrapper
          key={item.slug}
          ref={(e) => {
            if (e) dropdownMenuItemsRef.current[item.slug] = e;
          }}
        >
          <TActionsItem
            onClick={() => handleDropdownMenu(item.slug)}
            $active={activeDropdownMenu == item.slug}
          >
            <p>
              {`${item.label} ${item.slug == "perPage"
                ? item.selected
                : item.options[item.selected].toString().toLowerCase()
                }`}
            </p>
            <HiOutlineChevronDown />
          </TActionsItem>
          {activeDropdownMenu == item.slug && (
            <TActionsDropdown>
              {Object.keys(item.options).map((option) => (
                <TActionsDropdownItem
                  key={option}
                  href={{
                    pathname: pathname,
                    query: {
                      // ...queryParams,
                      // page: item.slug == "perPage" ? paginationParams.page,
                      [item.slug]: option,
                    }
                  }}
                >
                  {item.options[option]}
                  {item.slug == "perPage" ? "resultados" : ""}
                </TActionsDropdownItem>
              ))}
            </TActionsDropdown>
          )}
        </TActionsItemWrapper>
      ))}
    </>
  )









}