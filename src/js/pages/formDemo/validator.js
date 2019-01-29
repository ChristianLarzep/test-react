import validate from '../../lib/validate';

export const constraints = {
  name: {
    presence: true,
  },
  lastname: {
    presence: true,
  },
};

export default values => validate(values, constraints);
