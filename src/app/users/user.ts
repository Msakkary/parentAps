export interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  avatar: string;
  email: string;
  job_title: string;
}

const emptyUser = (): User => ({
  id: 0,
  first_name: '',
  last_name: '',
  user_name: '',
  job_title: '',
  email: '',
  avatar: ''
});
