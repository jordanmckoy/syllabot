"use client"

import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react"
import { Course, Unit } from "@prisma/client"
import DashboardLayout from "@/app/components/layout/Dashboard"
import { getMarkdown } from "@/utils/markdown";

type CourseWithUnits = Course & {
    Unit: Unit[]
}

export default function CoursePage({ params }: { params: { slug: string } }) {
    const [isAssistantModalOpen, setAssistantModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [unitContentHtml, setUnitContentHtml] = useState<any>("");
    const [data, setData] = useState<CourseWithUnits | null>(null)

    useEffect(() => {
        fetch(`/api/course?id=${params.slug}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                console.log(data)
            })
    }, [])

    if (!data) return (

        <DashboardLayout>
            <div>
                <h1>Course not found</h1>
            </div>
        </DashboardLayout>
    )

    const selectUnit = async (unit: Unit) => {
        setSelectedUnit(unit);
        const contentHtml = await getMarkdown(unit.content);
        setUnitContentHtml(contentHtml);
    };

    return (
        <DashboardLayout>
            <div className="flex p-6">
                {/* Left Column */}
                <div className="flex flex-col w-3/4">
                    <h1 className="text-2xl font-bold text-white">{data.name}</h1>
                    <p className="text-gray-300">{data.description}</p>

                    <h2 className="mt-6 text-xl font-semibold">{selectedUnit ? selectedUnit.name : "Select a unit"}</h2>
                    <div className="prose min-w-full mt-2 text-white" dangerouslySetInnerHTML={{ __html: unitContentHtml }} />
                </div>

                {/* Right Column */}
                <div className="w-1/4 ml-6 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Unit List</h2>
                        <ul className="space-y-2">
                            {data.Unit.map((unit, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer ${selectedUnit === unit ? "text-green-600" : "text-gray-300"
                                        }`}
                                    onClick={() => selectUnit(unit)}
                                >
                                    {unit.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        onClick={() => setAssistantModalOpen(true)}
                    >
                        Ask SyllaBot
                    </button>
                </div>

                {/* Assistant Modal */}
                <Transition appear show={isAssistantModalOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-50 overflow-y-auto"
                        onClose={() => setAssistantModalOpen(false)}
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
            </div>

        </DashboardLayout >
    )
}