import { clerkClient, getAuth } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
// // Update role to educator
// export const updateRoleToEducator = async (req, res) => {
//   try {
//     const userId = req.auth.userId;

//     await clerkClient.users.updateUserMetadata(userId, {
//       publicMetadata: {
//         role: 'educator',
//       },
//     });

//     res.json({ success: true, message: "You can publish a course now" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    console.log("isAuthenticated:", isAuthenticated);
    console.log("userId:", userId);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    return res.status(200).json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    console.error("Update educator role error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCourse = async (req, res) => {
  console.log("🔥 ADD COURSE CONTROLLER REACHED");
  try {
     const { courseData } = req.body;
        const imageFile = req.file;

        const { userId } = getAuth(req);

        console.log("userId:", userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated",
            });
        }

        const educatorId = userId;

        if (!imageFile) {
            return res.json({
                success: false,
                message: "Thumbnail Not Attached",
            });
        }

        const parsedCourseData = JSON.parse(courseData);

        parsedCourseData.educator = educatorId;

        const newCourse = await Course.create(parsedCourseData);

        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path
        );

        newCourse.courseThumbnail = imageUpload.secure_url;

        await newCourse.save();

        res.json({
            success: true,
            message: "Course Added",
        });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        const educator = userId;

        const courses = await Course.find({ educator });

        res.json({ success: true, courses });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses )

export const educatorDashboardData = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        const educator = userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        });

        const totalEarnings = purchases.reduce(
            (sum, purchase) => sum + purchase.amount,0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];

        for (const course of courses) {
            const students = await User.find(
            {_id: { $in: course.enrolledStudents }},"name imageUrl");

            students.forEach(student => {
              enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
              });
            });
        }

        res.json({success: true, dashboardData: {
          totalEarnings,enrolledStudentsData,totalCourses
        }})

    } catch (error) {
      res.json({success: false, message: error.message});
    }
};

// Get Enrolled Students Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const educator = userId;
        const courses = await Course.find({ educator });

        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        })
        .populate("userId", "name imageUrl")
        .populate("courseId", "courseTitle");

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

