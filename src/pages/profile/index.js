import useGetDataObject from "../../hooks/useGetDataObject";
import Loading from "../../components/loading";

export default function Profile() {
    let url = '/user'

    const [user, isLoading] = useGetDataObject(url)

    return (
        <div className="p-4">
            {isLoading ? (
                <Loading/>
            ) : (
                <>
                    <img className="w-32 h-32 rounded-full mx-auto"
                         src={user.img_url || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random&color=fff'}
                         alt="profile"/>
                    <h2 className="text-center text-2xl font-semibold mt-3">{user.name}</h2>
                    <p className="text-center text-gray-600 mt-1 dark:text-gray-400">{user.phone}</p>
                    <p className="text-center text-gray-600 mt-1 dark:text-gray-400">
                        {user?.role === "admin" ? (
                            "ម្ចាស់ហាង"
                        ) : user?.role === "manager" ? (
                            "អ្នកគ្រប់គ្រង"
                        ) : user?.role === "sale" ? (
                            "អ្នកលក់"
                        ) : (
                            "សមាជិក"
                        )}
                    </p>
                </>
            )}
        </div>
    )
}
