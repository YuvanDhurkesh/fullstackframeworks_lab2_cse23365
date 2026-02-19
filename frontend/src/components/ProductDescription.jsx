import React from 'react';

const ProductDescription = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <h1 className="text-3xl font-bold text-white">Product Description</h1>
                    <p className="text-blue-100">Lab Evaluation - 2</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Team Members Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Team Members</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Member 1 Placeholder */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                                    <span>Photo</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg text-gray-900">[Student 1 Name]</p>
                                    <p className="text-gray-600">[Roll Number]</p>
                                </div>
                            </div>

                            {/* Member 2 Placeholder */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                                    <span>Photo</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg text-gray-900">[Student 2 Name]</p>
                                    <p className="text-gray-600">[Roll Number]</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Course Details Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Course Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Course Information</h3>
                                    <p className="text-gray-600"><span className="font-medium">Code:</span> [Enter Course Code]</p>
                                    <p className="text-gray-600"><span className="font-medium">Name:</span> [Enter Course Name]</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700">GitHub Details</h3>
                                    <a href="#" className="text-blue-600 hover:underline break-all block mb-1">
                                        [Repository URL]
                                    </a>
                                    <a href="#" className="text-blue-600 hover:underline break-all block">
                                        [Product Page URL]
                                    </a>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <h3 className="font-semibold text-blue-800 mb-2">Course Teacher</h3>
                                <div className="text-gray-700 space-y-1">
                                    <p className="font-bold text-lg">Dr. T. Senthil Kumar</p>
                                    <p>Professor</p>
                                    <p>Amrita School of Computing</p>
                                    <p>Amrita Vishwa Vidyapeetham</p>
                                    <p>Coimbatore - 641112</p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        📧 <a href="mailto:t_senthilkumar@cb.amrita.edu" className="hover:text-blue-600">t_senthilkumar@cb.amrita.edu</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Collaborator Details */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Collaborators</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <h3 className="font-semibold text-purple-700 mb-2">Academic Collaborator</h3>
                                <p className="text-gray-800 font-medium">Dr. T. Senthil Kumar</p>
                                <p className="text-gray-600 text-sm">Amrita Vishwa Vidyapeetham</p>
                            </div>

                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <h3 className="font-semibold text-green-700 mb-2">Industry Collaborator</h3>
                                <p className="text-gray-800 font-medium">[Enter Name/Organization]</p>
                                <p className="text-gray-600 text-sm">[Designation/Details]</p>
                            </div>
                        </div>
                    </section>

                    {/* About Logic / Use Case (Brief) */}
                    <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">About the Project</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            This portal is designed to support children with autism by providing a stable,
                            predictable learning environment. It leverages <strong>Task Chaining</strong> to break
                            down complex math concepts and uses <strong>Keystroke & Mouse events</strong> to
                            bypass fine motor challenges.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            <strong>Key Highlights:</strong> Event-Driven Interaction (Keystrokes, Screen Capture)
                            and Gamified Social Context using Community Helpers.
                        </p>
                    </section>
                </div>

                <div className="bg-gray-100 px-6 py-4 text-center text-gray-500 text-sm">
                    Built with ReactJS • Evaluation Template
                </div>
            </div>
        </div>
    );
};

export default ProductDescription;
