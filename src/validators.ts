//@ts-nocheck
import { controlDigitIsValid } from './utils';

export function isNumber(options: { errorMessage: string }) {
  return function (id, data) {
    return Number.isFinite(parseFloat(data[id].value)) ? undefined : options.errorMessage;
  };
}

export function isInteger(options: { errorMessage: string }) {
  return function (id, data) {
    const isValidNumber = !Boolean(isNumber(options)(id, data));
    return isValidNumber && parseFloat(data[id].value) === parseInt(data[id].value) ? undefined : options.errorMessage;
  };
}

export function isGreaterThan(options: { errorMessage: string; greaterThan: number }) {
  return function (id, data) {
    return data[id].value > options.greaterThan ? undefined : options.errorMessage;
  };
}

export function isGeoCoordinate(options: { errorMessage: string }) {
  return function (id, data) {
    const isValidNumber = !Boolean(isNumber(options)(id, data));
    // todo: now we're only checking for general format validity.
    // Need to check for validity as a geo coordinate (eg max 180degrees in the integer part etc).

    return isValidNumber && new RegExp(/^[\+\-]?\d+(\.\d+)?$/).test(data[id].value) ? undefined : options.errorMessage;
  };
}

export function isValidGln13(options: { errorMessage: string }) {
  return function (id, data) {
    const value = data[id].value.trim();
    return new RegExp(/^\d{13}$/).test(value) && controlDigitIsValid(value) ? undefined : options.errorMessage;
  };
}

export function hasMinMembers(options: { errorMessage: string; atLeast: number }) {
  return function (id, data) {
    return data[id].children.length >= options.atLeast ? undefined : options.errorMessage;
  };
}

export function childrenAreValid(options: { errorMessage: string }) {
  return function (id, data) {
    let childHasError = false;

    for (const childId of data[id].children) {
      if (data[childId].errors.length !== 0) {
        childHasError = true;
        break;
      }
    }

    return childHasError ? options.errorMessage : undefined;
  };
}

export function isLessThan(options: { errorMessage: string; lessThan: number }) {
  return function (id, data) {
    return parseFloat(data[id].value) < options.lessThan ? undefined : options.errorMessage;
  };
}

export function isNotEmpty(options: { errorMessage: string }) {
  return function (id, data) {
    return data[id].value.trim() !== '' ? undefined : options.errorMessage;
  };
}

export function maxLength(options: { errorMessage: string; maxLength: number }) {
  return function (id, data) {
    return data[id].value.trim().length <= options.maxLength ? undefined : options.errorMessage;
  };
}

export function minLength(options: { errorMessage: string; minLength: number }) {
  return function (id, data) {
    return data[id].value.trim().length >= options.minLength ? undefined : options.errorMessage;
  };
}

export function isValidEmailAddress(options: { errorMessage: string }) {
  return function (id, data) {
    const localAndDomain = data[id].value.trim().split('@');

    if (localAndDomain.length === 2) {
      const [localPart, domainPart] = localAndDomain;

      const localPartIsValid = new RegExp(/^\w+(\.?[\w\-\+]+)*$/).test(localPart);
      const domainPartIsValid = new RegExp(/^(\w+)(\.\w+)*(\.\w{2,})$/).test(domainPart);

      return localPartIsValid && domainPartIsValid ? undefined : options.errorMessage;
    } else {
      return options.errorMessage;
    }
  };
}
