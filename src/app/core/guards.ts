import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { UserService } from "../features/users/services/user.service";

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  return !userService.isAuthorized();
}

export const profileGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  return userService.isAuthorized();
}
