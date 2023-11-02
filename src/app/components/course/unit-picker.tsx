'use client'
import { Dialog, Transition } from "@headlessui/react";
import { Unit } from "@prisma/client";
import { Fragment } from "react";

type ChildProps = {
    units: Unit[],
    setUnit: React.Dispatch<React.SetStateAction<Unit | null>>,
    unit: Unit | null,
    setModalState: React.Dispatch<React.SetStateAction<boolean>>,
    modalState: boolean
}

export default function UnitPicker(props: ChildProps) {
    return (
        <>
            <div className="w-1/4 ml-6 space-y-4">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Unit List</h2>
                    <ul className="space-y-2">
                        {props.units.map((unit, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer ${props.unit === unit ? "text-green-600" : "text-gray-300"
                                    }`}
                                onClick={() => props.setUnit(unit)}
                            >
                                {unit.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    onClick={() => props.setModalState(true)}
                >
                    Ask SyllaBot
                </button>
            </div>

            {/* Assistant Modal */}
            <Transition appear show={props.modalState} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-y-auto"
                    onClose={() => props.setModalState(false)}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-white"
                                >
                                    Assistant
                                </Dialog.Title>
                                <div className="p-5">
                                    {/* {selectedUnit ? (<AiChat unitId={selectedUnit.id} userId={session!.user.id} />) :
                                            <p className="text-white">Please select a unit to chat with SyllaBot</p>
                                        } */}
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}