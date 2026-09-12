window.deleteResource = async function (id) {
  const { error } = await db
    .from("resources")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Delete failed: " + error.message);
    console.error(error);
    return;
  }

  loadAdminResources();
};
