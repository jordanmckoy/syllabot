import { AcademicCapIcon } from '@heroicons/react/20/solid'
import { Course, User } from '@prisma/client'

type Props = {
    user: User
    courses: Course[]
}

export default function Details(props: Props) {
    return (
        <div className='card bg-gray-800 p-5 shadow-xl'>
            <div className="px-4 sm:px-0 text-white">
                <h3 className="text-base font-semibold leading-7 ">Student Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 ">Name</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-200 sm:col-span-2 sm:mt-0">{props.user.name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 ">Email</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-200 sm:col-span-2 sm:mt-0">{props.user.email}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 ">Courses</dt>
                        <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                {props.courses.map((course) =>
                                    <li key={course.id} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                        <div className="flex w-0 flex-1 items-center">
                                            <AcademicCapIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span className="flex-shrink-0 text-gray-400">
                                                    <img className='rounded-full w-10 h-10' src={course.image} alt={course.name} />
                                                </span>
                                                <span className="truncate font-medium text-gray-200">{course.name}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                View Progress
                                            </a>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}
