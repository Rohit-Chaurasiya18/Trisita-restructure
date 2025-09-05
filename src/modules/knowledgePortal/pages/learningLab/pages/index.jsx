import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { getLearningLab } from "@/modules/knowledgePortal/slice";
import routesConstants from "@/routes/routesConstants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LearningLab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { learningLabList, learningLabListLoading } = useSelector((state) => ({
    learningLabList: state?.knowledgePortal?.learningLabList,
    learningLabListLoading: state?.knowledgePortal?.learningLabListLoading,
  }));
  const workflows = [
    {
      id: 1,
      category: "Engineering, Procurement & Construction (EPC)",
      subcategories: [
        "AutoCAD",
        "Revit",
        "Navisworks",
        "BIM 360",
        "Autodesk Construction Cloud",
      ],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 2,
      category: "Builders & Developers",
      subcategories: ["Revit", "Civil 3D", "Autodesk Build", "Insight"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 3,
      category: "Building Construction",
      subcategories: ["Revit", "Navisworks", "BIM Collaborate Pro"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 4,
      category: "Facility Management",
      subcategories: ["Revit", "Autodesk Tandem", "Forge"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 5,
      category: "Information Technology (IT Infrastructure)",
      subcategories: ["AutoCAD", "Revit", "BIM 360"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 6,
      category: "Pharmaceutical Industry",
      subcategories: ["AutoCAD Plant 3D", "Revit", "Navisworks"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 7,
      category: "Process Manufacturing",
      subcategories: ["AutoCAD P&ID", "AutoCAD Plant 3D", "Inventor"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 8,
      category: "Industrial Machinery",
      subcategories: ["Inventor", "Fusion 360", "Vault"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 9,
      category: "Architecture",
      subcategories: [
        "Revit",
        "FormIt",
        "BIM Collaborate Pro",
        "Twinmotion",
        "Enscape",
      ],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 10,
      category: "Interior Design",
      subcategories: ["Revit", "AutoCAD", "3ds Max"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
    {
      id: 11,
      category: "Product Manufacturing",
      subcategories: ["Fusion 360", "Inventor", "AutoCAD"],
      imageUrl:
        "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg",
    },
  ];
  useEffect(() => {
    dispatch(getLearningLab());
  }, []);
  console.log(learningLabList, learningLabListLoading);
  return (
    <>
      {learningLabListLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div>
            <div className="commom-header-title mb-0">Learning Lab</div>
            <span className="common-breadcrum-msg">
              Check all the latest content
            </span>
          </div>
          <div className="learning-lab-container">
            {learningLabList?.map((workflow, index) => {
              return (
                <div key={index} className="event-card">
                  <div className="image-container">
                    <img
                      src={workflow?.image}
                      alt={`${workflow?.subcategories_name} Image`}
                      className="event-image"
                    />
                  </div>
                  <div className="card-content">
                    <h3 className="event-title">
                      {workflow?.product}
                    </h3>
                    <p className="event-description">
                      Explore the key products and workflows used in the{" "}
                      {workflow.subcategories_name} industry, as detailed in the Autodesk
                      documentation.
                    </p>
                    <button
                      className="more-button"
                      aria-label="Learn more"
                      onClick={() => {
                        navigate(
                          `${routesConstants.LEARNING_LAB}/${workflow?.id}`
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
export default LearningLab;
