import Image from "next/image";
import { useEffect, useState } from "react";

interface ConfusionModalProps {
  isOpen: boolean;
  item: Item
}

interface Item {
  id: number;
  image_path: string;
  category: string;
  title: string;
  description: string;
  condition: string;
}

interface Category {
  id: number;
  name: string;
}

const ScanModal: React.FC<ConfusionModalProps> = ({
  isOpen,
  item
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [categories, setCategories] = useState<Category[]>([]);
  const conditions = ["new", "flawless", "used", "worn"];
  const [categoryEdit, setCategoryEdit] = useState<string>();
  const [titleEdit, setTitleEdit] = useState<string>();
  const [descriptionEdit, setDescriptionEdit] = useState<string>();
  const [conditionEdit, setConditionEdit] = useState<string>();

  useEffect(() => {
    if (item) {
      setTitleEdit(item.title);
      setDescriptionEdit(item.description);
      setCategoryEdit(item.category);
      setConditionEdit(item.condition);
    }

    fetch(`${API_BASE_URL}/inventory/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [item]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Construct the payload
    const payload = {
      item_id: item.id,
      title: titleEdit,
      description: descriptionEdit,
      category: categoryEdit,
      condition: conditionEdit,
    };

    console.log("payload:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/inventory/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Successfully updated item");
      } else {
        const error = await response.json();
        console.error("Error saving changes:", error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl mx-4 rounded shadow-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            You just scanned this item!
          </h2>
          <div className="rounded-lg p-2 cursor-pointer flex flex-col flex-center">
            <div className="flex flex-col sm:flex-row justify-evenly">
              <Image
                src={item.image_path}
                alt="Titel"
                className="object-cover md:w-[420px] md:h-[420px] w-[350px] h-[350px]"
                width={400}
                height={400}
              />
              <div className="w-80 flex items-center justify-center">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2 mt-2 sm:mt-0">
                    <label
                      htmlFor="title"
                      className="block text-gray-700 font-medium mb-1 text-lg"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="w-80 px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                      placeholder="Enter your title"
                      value={titleEdit || ""}
                      onChange={(e) => setTitleEdit(e.target.value)}
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      htmlFor="description"
                      className="block text-gray-700 font-medium mb-1 text-lg"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="w-80 px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green resize-y"
                      placeholder="Enter your description"
                      value={descriptionEdit || ""}
                      onChange={(e) => setDescriptionEdit(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      htmlFor="category"
                      className="block text-gray-700 font-medium mb-1 text-lg"
                    >
                      Category
                    </label>
                    <select
                      value={categoryEdit}
                      onChange={(e) => setCategoryEdit(e.target.value)}
                      id="category"
                      name="category"
                      className="w-80 bg-white px-4 py-2.5 border rounded-md mb-4 sm:mb-0"
                    >
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="condition"
                      className="block text-gray-700 font-medium mb-1 text-lg"
                    >
                      Condition
                    </label>
                    <select
                      value={conditionEdit}
                      id="condition"
                      name="condition"
                      onChange={(e) => setConditionEdit(e.target.value)}
                      className="w-80 bg-white px-4 py-2.5 border rounded-md mb-4 sm:mb-0"
                    >
                      {conditions.map((conditions) => (
                        <option key={conditions} value={conditions}>
                          {conditions}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      type="submit"
                      className="bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-dark-green mt-5"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50">
          <p>
            Are the details correct?{" "}
            <strong>
              If so, please put the item in the storage compartment.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanModal;
