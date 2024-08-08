import React from "react";
import { Formik, Field, Form } from "formik";
import { useState } from "react";

const itemCategories = [
  {
    name: "Bracelets",
    items: [
      { id: 1, name: "Jasinthe Bracelet" },
      { id: 2, name: "Jasinthe Bracelet" },
      { id: 3, name: "Inspire Bracelet" },
    ],
  },
  {
    name: "",
    items: [
      { id: 4, name: "Zero amount item with questions" },
      { id: 5, name: "Normal item with questions" },
      { id: 6, name: "normal item" },
    ],
  },
];

const initialValues = {
  taxName: "",
  taxRate: "",
  applyTo: "specific",
  selectedItems: [],
};

function TaxForm() {
  const [selectedItems, setSelectedItems] = useState([]);
  const handleSubmit = (values) => {
    const applicableItems =
      values.applyTo === "all"
        ? itemCategories.flatMap((category) =>
            category.items.map((item) => item.id)
          )
        : values.selectedItems;

    const appliedTo = values.applyTo;

    console.log({
      applicable_items: applicableItems,
      applied_to: appliedTo,
      name: values.taxName,
      rate: parseFloat(values.taxRate) / 100,
    });
  };

  const handleCategorySelect = (category, isSelected) => {
    let updatedItems;
    if (isSelected) {
      updatedItems = [
        ...selectedItems,
        ...category.items.map((item) => item.id),
      ];
    } else {
      updatedItems = selectedItems.filter(
        (id) => !category.items.some((item) => item.id === id)
      );
    }
    setSelectedItems(updatedItems);
  };
  const handleItemSelect = (itemId, isSelected) => {
    const updatedItems = isSelected
      ? [...selectedItems, itemId]
      : selectedItems.filter((id) => id !== itemId);
    setSelectedItems(updatedItems);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <div>
            <label htmlFor="taxName">Tax Name</label>
            <Field type="text" name="taxName" />
          </div>

          <div>
            <label htmlFor="taxRate">Tax Rate</label>
            <Field type="number" name="taxRate" />
          </div>

          <div>
            <label>
              <Field
                type="radio"
                name="applyTo"
                value="all"
                onClick={() =>
                  setSelectedItems(
                    itemCategories.flatMap((category) =>
                      category.items.map((item) => item.id)
                    )
                  )
                }
              />
              Apply to all items in collection
            </label>

            <label>
              <Field
                type="radio"
                name="applyTo"
                value="specific"
                onClick={() => setSelectedItems([])}
              />
              Apply to specific items
            </label>
          </div>

          {values.applyTo === "specific" && (
            <div>
              <input type="text" placeholder="Search Items" />
              {itemCategories.map((category, index) => (
                <div
                  key={index}
                  style={category.name ? { backgroundColor: "#f0f0f0" } : {}}
                >
                  {category.name && (
                    <label>
                      <Field
                        type="checkbox"
                        onChange={(e) =>
                          handleCategorySelect(category, e.target.checked)
                        }
                      />

                      {category.name}
                    </label>
                  )}

                  <div>
                    {category.items.map((item) => (
                      <label key={item.id}>
                        <Field
                          type="checkbox"
                          name="selectedItems"
                          value={item.id}
                          onChange={(e) =>
                            handleItemSelect(item.id, e.target.checked)
                          }
                        />
                        {item.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="submit">
            Apply tax to {selectedItems.length} item(s)
          </button>
        </Form>
      )}
    </Formik>
  );
}
export default TaxForm;
