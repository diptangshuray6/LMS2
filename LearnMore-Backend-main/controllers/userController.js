import { getAuth } from "@clerk/express";
import User from "../models/User.js";

// Get User Data
export const getUserData = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User Not Found"
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Users Enrolled Courses With lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }

        const userData = await User.findById(userId)
            .populate("enrolledCourses");

        res.json({
            success: true,
            enrolledCourses: userData.enrolledCourses
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};