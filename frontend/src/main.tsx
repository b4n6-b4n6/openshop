if (import.meta.env.MODE === "onion") {
  void import("./onion/main");
} else {
  void import("./local/main");
}
