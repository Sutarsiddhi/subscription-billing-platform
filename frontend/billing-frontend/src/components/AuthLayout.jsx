import { FaCheckCircle } from "react-icons/fa";

function AuthLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#FAF7F2]">

            {/* Decorative Blob 1 */}

            <div className="absolute -top-52 -left-52 h-[450px] w-[450px] rounded-full bg-violet-300 blur-[140px] opacity-40"></div>

            {/* Decorative Blob 2 */}

            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-pink-300 blur-[130px] opacity-40"></div>

            {/* Decorative Blob 3 */}

            <div className="absolute top-1/2 left-1/2 h-[250px] w-[250px] rounded-full bg-orange-200 blur-[110px] opacity-30"></div>

            <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-8 flex items-center">

                {/* LEFT CONTENT */}

                <div className="w-full lg:w-[55%]">

                    <span className="inline-block px-4 py-2 rounded-full bg-white shadow text-sm font-semibold text-violet-700">

                        Subscription Management Platform

                    </span>

                    <h1 className="mt-8 text-6xl font-extrabold leading-tight text-gray-900">

                        Manage your

                        <span className="text-violet-600">

                            {" "}billing{" "}

                        </span>

                        without the stress.

                    </h1>

                    <p className="mt-8 text-xl text-gray-600 leading-9 max-w-xl">

                        Automate recurring subscriptions, invoice generation,
                        payment retries and customer lifecycle management
                        from one beautiful dashboard.

                    </p>

                    <div className="mt-12 space-y-5">

                        <Feature text="Recurring Subscription Billing" />

                        <Feature text="Automated Invoice Generation" />

                        <Feature text="Payment Retry Engine" />

                        <Feature text="Revenue Analytics Dashboard" />

                    </div>

                </div>

                {/* LOGIN CARD */}

                <div className="hidden lg:flex justify-end w-[45%]">

                    <div className="w-[430px]">

                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">

                            {children}

                        </div>

                    </div>

                </div>

            </div>

            {/* Mobile */}

            <div className="lg:hidden flex justify-center items-center min-h-screen p-6">

                <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

                    {children}

                </div>

            </div>

        </div>
    );
}

function Feature({ text }) {
    return (
        <div className="flex items-center gap-4">

            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">

                <FaCheckCircle className="text-violet-600" />

            </div>

            <span className="text-lg text-gray-700">

                {text}

            </span>

        </div>
    );
}

export default AuthLayout;