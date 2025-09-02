import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const Dropdown = ({ data }) => {
	const [dropText, setDropText] = useState(data.dropdownHeader);
    
	return (
		<Menu as="div" className="relative inline-block">
			<MenuButton className="inline-flex w-full justify-center gap-x-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-800 px-3 py-2 text-md font-semibold text-white inset-ring-1 inset-ring-white/5">
				{dropText}
				<ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-yellow-300" />
			</MenuButton>

			<MenuItems
				transition
				className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
			>
				<div className="py-1">
					{data.list.map((item) => {
						return <MenuItem key={item}>
							<a
								href="#"
								className="block px-4 py-2 text-sm text-yellow-200 data-focus:bg-white/5 data-focus:text-yellow-500 data-focus:outline-hidden"
								onClick={() => setDropText(item)}
							>
								{item}
							</a>
						</MenuItem>;
					})}
				</div>
			</MenuItems>
		</Menu>
	);
};

export default Dropdown;
