window.deleteResource = async function (id) {
  if (!confirm("Delete this resource?")) return;

  const { error } = await db
    .from("resources")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Delete failed: " + error.message);
    console.error(error);
    return;
  }

  alert("Resource deleted.");

  if (typeof loadAdminResources === "function") {
    loadAdminResources();
  }
};
