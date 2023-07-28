import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    gridItem: {
      padding: "0px 8px",
    },
    card: {
      width: "200px",
      height: "240px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "box-shadow 0.3s ease",
      "&:hover": {
        boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.3 )",
      },
      cursor: "pointer"
    },
    cardContent: {
      textAlign: "center",
    },
    image: {
      width: "180px",
      height: "180px",
      paddingTop: "20px",
    },
    title: {
      color: "#F4F3CC",
      fontWeight: "bold",
    },
    theme: {
      color: "#F4F3CC",
    },
    chevron: {
      position: "absolute",
      right: 10,
      // bottom: 10,
      opacity: 0.8,
      fontSize: "3rem",
      "&:hover": {
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.6)",
      },
      transition: "opacity 0.3s ease",
    },
  }));

export default useStyles;
