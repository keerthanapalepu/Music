import React from "react";
import { Card, CardContent, Typography } from '@material-ui/core';
import useStyles from './homeStyles';

const CardItem = ({ item, onClick }) => {
  const classes = useStyles();
  const language = localStorage.getItem('selectedLanguage');
  return (
    <Card className={classes.card} onClick={onClick}>
      <CardContent className={classes.cardContent}>
        <div>
          <img src={item.url} className={classes.image} alt={item.name} />
          <Typography className={classes.title}>{item.day}</Typography>
          <Typography className={classes.theme}>
            {/* {language === "telugu"?  item.teluguTheme : item.hindiTheme} */}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;
