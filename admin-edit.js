window.editResource = async function (id) {
  const title = prompt("Enter new title:");
  if (title === null) return;

  const description = prompt("Enter new description:");
  if (description === null) return;

  const { data, error } = await db
    .from("resources")
    .update({
      title: title,
      description: description
    })
    .eq("id", id)
    .select();

  console.log("EDIT RESULT:", data);
  console.log("EDIT ERROR:", error);

  if (error) {
    alert("Edit failed: " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("0 rows updated — RLS is blocking this update.");
    return;
  }

  alert("Resource updated!");
  loadAdminResources();
};
