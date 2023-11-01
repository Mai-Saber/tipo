import * as React from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

function Tree() {
  return (
    <Box sx={{ minHeight: 220, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="multi-select"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
      >
        <TreeItem nodeId="1" label="Documents">
          <TreeItem nodeId="2" label="MUI">
            <TreeItem nodeId="3" label="src">
              <TreeItem nodeId="4" label="index.js" />
              <TreeItem nodeId="5" label="tree-view.js" />
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeView>
    </Box>
  );
}

export default Tree;
