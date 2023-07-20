import React from "react";
import { Card, CardContent, Typography } from '@material-ui/core';
import useStyles from '../homeStyles';

const CardItem = ({ item, onClick }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} onClick={onClick}>
      <CardContent className={classes.cardContent}>
        <div>
          <img src={item.url} className={classes.image} alt={item.name} />
          <Typography className={classes.title}>{item.day}</Typography>
          <Typography className={classes.theme}>
            {item.theme}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;
