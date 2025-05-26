import { useState } from "react";
import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import SearchBar from "../../ui/SearchBar";
import { useSearchParams } from "react-router-dom";

function BookingTableOperations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSearch(e) {
    setSearchQuery(e);
    if (e) {
      searchParams.set("search", e);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  }

  return (
    <TableOperations>
      <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "checked-out", label: "Checked out" },
          { value: "checked-in", label: "Checked in" },
          { value: "unconfirmed", label: "Unconfirmed" },
        ]}
      />

      <SortBy
        options={[
          { value: "startDate-desc", label: "Sort by date (recent first)" },
          { value: "startDate-asc", label: "Sort by date (earlier first)" },
          {
            value: "totalPrice-desc",
            label: "Sort by amount (high first)",
          },
          { value: "totalPrice-asc", label: "Sort by amount (low first)" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
