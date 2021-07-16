const comparer = async (arr1, arr2) => {
  return function (current) {
    return (
      arr1.filter(function (arr2) {
        return arr2.name == current.name && arr2.dispo == current.dispo;
      }).length == 0
    );
  };
};

module.exports = comparer;
