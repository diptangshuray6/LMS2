import { clerkClient,getAuth } from "@clerk/express";

// Middleware ( Protect Educator Routes )
export const protectEducator = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);       

         if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated",
            });
        }

         const response = await clerkClient.users.getUser(userId);

        if (response.publicMetadata.role !== "educator") {
            return res.json({
                success: false,
                message: "Unauthorized Access"
            });
        }

        next();

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// export const protectEducator = async (req, res, next) => {
//     try {
//         console.log("1. protectEducator reached");
//         console.log("req.auth:", req.auth);

//         const userId = req.auth.userId;
//         console.log("2. userId:", userId);

//         const response = await clerkClient.users.getUser(userId);
//         console.log("3. Clerk user:", response);

//         if (response.publicMetadata.role !== "educator") {
//             return res.json({
//                 success: false,
//                 message: "Unauthorized Access"
//             });
//         }

//         console.log("4. Educator verified");

//         next();

//     } catch (error) {
//         console.error("❌ protectEducator error:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };