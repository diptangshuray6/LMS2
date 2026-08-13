import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Link } from "react-router";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext); // to collect it form App Context the env value which is used globally

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="pb-6 overflow-hidden border rounded-lg border-gray-500/30"
    >
      <img className="w-full" src={course.courseThumbnail} alt="" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>
        <p className="text-gray-500">GreatStack</p>
        <div className="flex items-center space-x-2">
          <p>{calculateRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt=""
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500">{course.courseRatings.length}</p>
        </div>
        <p className="text-base font-semibold text-gray-800">
          {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
