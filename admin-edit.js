window.editResource = async function (id) {
  const title = prompt("Enter new title:");
  if (title === null) return;

  const description = prompt("Enter new description:");
  if (description === null) return;

  const { error } = await db
    .from("resources")
    .update({
      title: title,
      description: description
    })
    .eq("id", id);

  if (error) {
    alert("Edit failed: " + error.message);
    console.error(error);
    return;
  }

  loadAdminResources();
};
