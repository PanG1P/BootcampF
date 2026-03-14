export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      
      <aside style={{ width: "200px", background: "#eee", padding: "20px" }}>
        <h3>Admin</h3>
        <ul>
          <li>Dashboard</li>
          <li>Products</li>
          <li>Orders</li>
          <li>Resellers</li>
        </ul>
      </aside>
      <main style={{ padding: "20px", flex: 1 }}>
        {children}
      </main>

    </div>
  );
}