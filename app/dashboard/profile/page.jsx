import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit, User } from 'lucide-react'
import React from 'react'

const user = {
    name: "Md Parvej",
    email: "mdparvej@gmail.com",
    phone: "01712345678",
    country: "Bangladesh",
    division: "Barisal",
    city: "Bhola",
    Upzala: "Daulatkhan",
    postCode: "8300",
    detailsAddress: "South Joynogor, Banglabazar Bhola",
}

export default function ProfilePage() {
    return (
        <div className="container mx-auto p-6">
            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg border shadow-lg">
                    <div className="flex justify-center items-center w-[100px] h-[100px] bg-gray-200 border border-gray-300 shadow rounded-full mx-auto mb-4">
                        <User size={40} />
                    </div>
                    <h2 className="text-center text-xl font-semibold">{user.name}</h2>
                    <p className="text-center text-gray-500">{user.email}</p>
                    <hr className="my-5" />
                    <ul className="space-y-2 text-gray-700">
                        <li><strong>Phone:</strong> {user.phone}</li>
                        <li><strong>Country:</strong> {user.country}</li>
                        <li><strong>Division:</strong> {user.division}</li>
                        <li><strong>District:</strong> {user.city}</li>
                        <li><strong>Upazila:</strong> {user.Upzala}</li>
                        <li><strong>Post Code:</strong> {user.postCode}</li>
                        <li><strong>Address:</strong> {user.detailsAddress}</li>
                    </ul>
                </div>

                {/* Edit Form */}
                <div className="bg-white p-6 rounded-lg border shadow-lg lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-semibold">Edit your Shipping Address</h3>
                        <Button className="bg-[#3BB77E] hover:bg-[#008236] text-white rounded-md flex items-center">
                            <Edit size={20} className="mr-2" />
                            Edit
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input type="text" placeholder="Full Name" className="bg-white" />
                        <Input type="email" placeholder="Email" value={user.email} className="cursor-not-allowed bg-white" disabled />
                        <Input type="text" placeholder="Phone Number" className="bg-white" />
                        <Input type="text" placeholder="Country" className="bg-white" />
                        <Input type="text" placeholder="Division" className="bg-white" />
                        <Input type="text" placeholder="District" className="bg-white" />
                        <Input type="text" placeholder="Upazila" className="bg-white" />
                        <Input type="text" placeholder="Post/Zip Code" className="bg-white" />
                        <Textarea placeholder="Details Address" className="w-full bg-white col-span-2" />
                    </div>
                    <Button className="mt-6 w-full bg-[#3BB77E] hover:bg-[#008236] text-white rounded-md">Save Changes</Button>
                </div>
            </div>
        </div>
    )
}
