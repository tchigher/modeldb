import { action } from 'typesafe-actions';

import { ICollaboratorsWithOwner, Project, UserAccess } from 'models/Project';
import User from 'models/User';
import { ActionResult } from 'store/store';
import cloneClassInstance from 'utils/cloneClassInstance';
import {
  IUpdateProjectByIdAction,
  removeCollaboratorFromProject,
  selectProject,
  updateProjectById,
  updateProjectCollaboratorAccess,
} from '../projects';
import {
  changeAccessActionTypes,
  changeOwnerActionTypes,
  IChangeAccessActions,
  IChangeOwnerActions,
  ILoadCollaboratorsWithOwnerActions,
  IRemoveAccessActions,
  IResetChangeAccessAction,
  IResetChangeOwnerAction,
  IResetInvitationAction,
  IResetRemoveAccessAction,
  ISendInvitationActions,
  loadCollaboratorsWithOwnerActionTypes,
  removeAccessActionTypes,
  resetChangeAccessActionTypes,
  resetChangeOwnerActionTypes,
  resetInvitationActionTypes,
  resetRemoveAccessActionTypes,
  sendInvitationActionTypes,
} from './types';

export const sendInvitationForUser = (
  projectId: string,
  email: string,
  userAccess: UserAccess
): ActionResult<void, ISendInvitationActions> => async (
  dispatch,
  getState,
  { ServiceFactory }
) => {
  dispatch(action(sendInvitationActionTypes.REQUEST));

  await ServiceFactory.getCollaboratorsService()
    .sendInvitationWithInvitedUser(projectId, email, userAccess)
    .then(res => {
      dispatch(action(sendInvitationActionTypes.SUCCESS));
      dispatch(updateProjectCollaboratorAccess(projectId, res, userAccess));
    })
    .catch(err => {
      dispatch(
        action(sendInvitationActionTypes.FAILURE, err.response.data.error)
      );
    });
};

export const resetInvitationState = (): ActionResult<
  void,
  IResetInvitationAction
> => async dispatch => {
  dispatch(action(resetInvitationActionTypes.RESET_INVITATION_STATE));
};

export const changeProjectOwner = (
  projectId: string,
  email: string
): ActionResult<void, IChangeOwnerActions> => async (
  dispatch,
  _,
  { ServiceFactory }
) => {
  dispatch(action(changeOwnerActionTypes.REQUEST));

  await ServiceFactory.getCollaboratorsService()
    .changeOwner(projectId, email)
    .then(res => {
      dispatch(action(changeOwnerActionTypes.SUCCESS));
      dispatch(
        updateProjectCollaboratorAccess(
          projectId,
          new User(undefined, email),
          UserAccess.Owner
        )
      );
    })
    .catch(err => {
      dispatch(action(changeOwnerActionTypes.FAILURE, err as string));
    });
};

export const resetChangeOwnerState = (): ActionResult<
  void,
  IResetChangeOwnerAction
> => async dispatch => {
  dispatch(action(resetChangeOwnerActionTypes.RESET_CHANGE_OWNER));
};

export const changeAccessToProject = (
  projectId: string,
  user: User,
  userAccess: UserAccess
): ActionResult<void, IChangeAccessActions> => async (
  dispatch,
  _,
  { ServiceFactory }
) => {
  dispatch(action(changeAccessActionTypes.REQUEST, user.id!));

  console.log(user);

  await ServiceFactory.getCollaboratorsService()
    .changeAccessToProject(projectId, user.id!, userAccess)
    .then(res => {
      dispatch(action(changeAccessActionTypes.SUCCESS, user.id!));
      dispatch(updateProjectCollaboratorAccess(projectId, user, userAccess));
    })
    .catch(err => {
      dispatch(
        action(changeAccessActionTypes.FAILURE, {
          userId: user.id!,
          error: err,
        })
      );
    });
};

export const resetChangeAccessState = (): ActionResult<
  void,
  IResetChangeAccessAction
> => async dispatch => {
  dispatch(action(resetChangeAccessActionTypes.RESET_CHANGE_ACCESS));
};

export const removeAccessFromProject = (
  projectId: string,
  user: User
): ActionResult<void, IRemoveAccessActions> => async (
  dispatch,
  _,
  { ServiceFactory }
) => {
  dispatch(action(removeAccessActionTypes.REQUEST, user.id!));

  await ServiceFactory.getCollaboratorsService()
    .removeAccessFromProject(projectId, user.id!)
    .then(res => {
      dispatch(action(removeAccessActionTypes.SUCCESS, user.id!));
      dispatch(removeCollaboratorFromProject(projectId, user));
    })
    .catch(err => {
      dispatch(
        action(removeAccessActionTypes.FAILURE, {
          userId: user.id!,
          error: err as string,
        })
      );
    });
};

const addCollaboratorsWithOwnerInProject = (
  project: Project,
  { owner, collaborators }: ICollaboratorsWithOwner
) => {
  const updatedProject = cloneClassInstance(project);
  updatedProject.collaborators = new Map(
    collaborators.map(collaborator => [collaborator, collaborator.access])
  );
  updatedProject.Author = owner;
  return updatedProject;
};

export const loadCollaboratorsWithOwner = (
  project: Project
): ActionResult<
  void,
  ILoadCollaboratorsWithOwnerActions | IUpdateProjectByIdAction
> => async (dispatch, getState, { ServiceFactory }) => {
  dispatch(action(loadCollaboratorsWithOwnerActionTypes.REQUEST, project));

  await ServiceFactory.getCollaboratorsService()
    .loadProjectCollaboratorsWithOwner(project.id, project.authorId)
    .then(data => {
      dispatch(
        action(loadCollaboratorsWithOwnerActionTypes.SUCCESS, {
          projectId: project.id,
          data,
        })
      );
      dispatch(
        updateProjectById(addCollaboratorsWithOwnerInProject(project, data))
      );
    })
    .catch(error => {
      dispatch(
        action(loadCollaboratorsWithOwnerActionTypes.FAILURE, {
          projectId: project.id,
          error,
        })
      );
    });
};

export const resetRemoveAccessState = (): ActionResult<
  void,
  IResetRemoveAccessAction
> => async dispatch => {
  dispatch(action(resetRemoveAccessActionTypes.RESET_REMOVE_ACCESS));
};