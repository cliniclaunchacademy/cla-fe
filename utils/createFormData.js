export const createFormData = (data, fileFields = []) => {
  // In filefields keep that variable which contain single or multiple file
  const formData = new FormData();

  // Handle file fields
  fileFields.forEach((field) => {
    const value = data[field];

    if (Array.isArray(value)) {
      // Multiple files
      value.forEach((file) => {
        if (file instanceof File) {
          formData.append(field, file);
        }
      });
    } else if (value instanceof File) {
      // Single file
      formData.append(field, value);
    }
  });

  // Handle other non-file fields
  Object.keys(data).forEach((key) => {
    if (!fileFields.includes(key)) {
      const value = data[key];

      if (Array.isArray(value)) {
        // ✅ stringify array (for existingEventPosters or similar)
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};
