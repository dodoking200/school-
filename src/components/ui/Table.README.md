# Enhanced Table Component

A highly customizable and reusable table component for displaying data in various formats across the application.

## Features

- **Flexible Header**: Customizable title, filter, and action buttons
- **Styling Options**: Custom class names for all major elements
- **Responsive Design**: Built-in responsive mode for mobile devices
- **Loading State**: Built-in loading indicator
- **Empty State**: Customizable empty state message
- **Compact Mode**: Option for reduced padding in space-constrained layouts
- **Custom Header**: Option to completely replace the default header
- **Footer Support**: Optional footer content for pagination or summary information
- **Automatic Table Structure**: Automatically adds thead and tbody when not provided

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Title of the table |
| `tableHeader` | `React.ReactNode` | - | Table header content (thead element) |
| `tableContent` | `React.ReactNode` | - | Table body content (tbody element) |
| `filter` | `React.ReactNode` | - | Optional filter component to display in the header |
| `actions` | `React.ReactNode` | - | Optional additional actions (buttons, links) to display in the header |
| `className` | `string` | `""` | Optional custom class names for the container |
| `tableClassName` | `string` | `""` | Optional custom class names for the table element |
| `titleClassName` | `string` | `""` | Optional custom class names for the title |
| `filterClassName` | `string` | `""` | Optional custom class names for the filter container |
| `actionsClassName` | `string` | `""` | Optional custom class names for the actions container |
| `tableWrapperClassName` | `string` | `""` | Optional custom class names for the table wrapper |
| `theadClassName` | `string` | `"bg-gray-50"` | Optional custom class names for the thead element |
| `tbodyClassName` | `string` | `"bg-white divide-y divide-gray-200"` | Optional custom class names for the tbody element |
| `compact` | `boolean` | `false` | Optional flag to make the table compact (less padding) |
| `responsive` | `boolean` | `true` | Optional flag to make the table responsive |
| `hideHeader` | `boolean` | `false` | Optional flag to hide the header section (title, filter, actions) |
| `customHeader` | `React.ReactNode` | - | Optional custom header component to replace the default header |
| `footer` | `React.ReactNode` | - | Optional footer content |
| `isLoading` | `boolean` | - | Optional loading state |
| `emptyMessage` | `string` | - | Optional empty state message when there's no data |
| `defaultColumnHeader` | `string` | `"Content"` | Optional default column header text when auto-generating thead |

## Usage Examples

### Basic Usage

```tsx
import Table from "../ui/Table";

export default function BasicTable() {
  const header = (
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
  );
  
  const content = (
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
      </tr>
      <tr>
        <td>Jane Smith</td>
        <td>jane@example.com</td>
      </tr>
    </tbody>
  );
  
  return (
    <Table 
      title="Basic Table Example"
      tableHeader={header}
      tableContent={content}
    />
  );
}
```

### Inline Definition

```tsx
import Table from "../ui/Table";

export default function InlineTable() {
  return (
    <Table 
      title="Inline Table Example"
      tableHeader={
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
      }
      tableContent={
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
          </tr>
        </tbody>
      }
    />
  );
}
```

### With Filter and Actions

```tsx
import Table from "../ui/Table";

export default function TableWithFilterAndActions() {
  const [filter, setFilter] = useState("all");
  
  const filterComponent = (
    <select 
      value={filter} 
      onChange={(e) => setFilter(e.target.value)}
      className="border border-gray-300 rounded-lg p-2"
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );
  
  const actionsComponent = (
    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
      Add New
    </button>
  );
  
  return (
    <Table 
      title="Users" 
      filter={filterComponent}
      actions={actionsComponent}
      tableHeader={
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
      }
      tableContent={
        <tbody>
          {/* Table rows would go here */}
        </tbody>
      }
    />
  );
}
```

### Loading State and Empty Message

```tsx
import Table from "../ui/Table";

export default function LoadingTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([]);
      setLoading(false);
    }, 2000);
  }, []);
  
  return (
    <Table 
      title="Data Table" 
      isLoading={loading}
      emptyMessage="No data available"
      tableHeader={
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
      }
      tableContent={
        data.length > 0 ? (
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        ) : null
      }
    />
  );
}
```

### Compact Mode with Custom Styling

```tsx
import Table from "../ui/Table";

export default function CompactTable() {
  return (
    <Table 
      title="Compact Table" 
      compact={true}
      className="bg-gray-50"
      tableClassName="text-sm"
      titleClassName="text-blue-600"
      theadClassName="bg-blue-100"
      tbodyClassName="bg-white"
      tableHeader={
        <thead>
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Name</th>
          </tr>
        </thead>
      }
      tableContent={
        <tbody>
          <tr>
            <td className="px-3 py-2">1</td>
            <td className="px-3 py-2">John Doe</td>
          </tr>
          <tr>
            <td className="px-3 py-2">2</td>
            <td className="px-3 py-2">Jane Smith</td>
          </tr>
        </tbody>
      }
    />
  );
}
```

### With Footer (Pagination)

```tsx
import Table from "../ui/Table";

export default function TableWithPagination() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);
  
  const paginationFooter = (
    <div className="flex justify-between items-center">
      <div>Showing page {page} of 10</div>
      <div className="flex space-x-2">
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          className="px-3 py-1 border rounded"
          disabled={page === 1}
        >
          Previous
        </button>
        <button 
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded"
          disabled={page === 10}
        >
          Next
        </button>
      </div>
    </div>
  );
  
  return (
    <Table 
      title="Paginated Table" 
      footer={paginationFooter}
      tableHeader={
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
      }
      tableContent={
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      }
    />
  );
}
```

### Using Default Table Structure

```tsx
import Table from "../ui/Table";

export default function SimpleTable() {
  return (
    <Table 
      title="Simple Content" 
      defaultColumnHeader="Description"
      tableContent={
        <tbody>
          <tr>
            <td>This content uses the default thead structure</td>
          </tr>
        </tbody>
      }
    />
  );
}
```

### Custom Content Structure

```tsx
import Table from "../ui/Table";

export default function CustomContentTable() {
  return (
    <Table 
      title="Custom Structure" 
      tableHeader={
        <thead>
          <tr>
            <th colSpan={3} className="p-0 border-0">
              <div className="bg-yellow-50 p-2 text-center">
                <h3 className="text-yellow-700">Custom Header</h3>
              </div>
            </th>
          </tr>
        </thead>
      }
      tableContent={
        <tbody>
          <tr>
            <td colSpan={3} className="p-0 border-0">
              <div className="p-4 text-center bg-yellow-50">
                <p>This is a custom content structure</p>
              </div>
            </td>
          </tr>
        </tbody>
      }
    />
  );
}
```

## Migration Guide

If you're updating from the previous Table component, here's how to migrate:

### Before (Old Version)

```tsx
<Table title="Student" filter={classFilter}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Class</th>
    </tr>
  </thead>
  <tbody>
    {students.map(student => (
      <tr key={student.id}>
        <td>{student.name}</td>
        <td>{student.class}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

### After (Current Version)

```tsx
<Table 
  title="Student" 
  filter={classFilter}
  responsive={true}
  emptyMessage="No students found"
  tableHeader={
    <thead>
      <tr>
        <th>Name</th>
        <th>Class</th>
      </tr>
    </thead>
  }
  tableContent={
    <tbody>
      {students.map(student => (
        <tr key={student.id}>
          <td>{student.name}</td>
          <td>{student.class}</td>
        </tr>
      ))}
    </tbody>
  }
/>
```

## Best Practices

1. **Always use `tableHeader` and `tableContent` props** for better semantic structure and improved code organization.
2. **Use the `responsive` prop** for tables that might contain a lot of columns or be viewed on mobile devices.
3. **Provide an `emptyMessage`** to give users feedback when there's no data to display.
4. **Use the `actions` prop** for primary actions related to the table (e.g., "Add New", "Export").
5. **Use the `compact` prop** for tables in sidebars or other space-constrained areas.
6. **Use custom class names** to maintain consistent styling with your design system.
7. **Let the component handle thead structure** for simple content by not providing tableHeader explicitly.
8. **Use custom styling props** like `theadClassName` and `tbodyClassName` to maintain consistent styling across tables.
9. **Separate table structure concerns** by defining header and content separately, which improves code organization and readability.