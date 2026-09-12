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

  if (error) {
    alert("EDIT ERROR: " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("EDIT: 0 rows updated");
    return;
  }

  alert("EDIT SUCCESS");
  loadAdminResources();
};
