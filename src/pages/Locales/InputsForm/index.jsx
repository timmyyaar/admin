import React, { useEffect, useState } from 'react';

import { addLocale, updateLocale, deleteLocale } from '../actions';

import './style.css';

export const InputsForm = (props) => {
  const { locale, newLocale, setLoading, setUpdate } = props;
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [editMode, setEditMode] = useState(false);

  const onAddLocale = () => {
    setLoading(true);
    addLocale({ key, value, locale: locale.locale }).then(() => {
      setKey('');
      setValue('');
      setTimeout(() => {
        setLoading(false);
        setUpdate();
      }, 500);
    });
  };

  const onUpdateLocale = () => {
    setLoading(true);
    console.log({ key, value, locale: locale.locale });
    updateLocale({ key, value, locale: locale.locale }).then((data) => {
      setKey(data.key);
      setValue(data.value);
      setTimeout(() => {
        setLoading(false);
        setUpdate();
      }, 500);
    });
  };

  const onDeleteLocale = () => {
    setLoading(true);
    deleteLocale({ key, value, locale: locale.locale }).then(() => {
      setKey('');
      setValue('');
      setTimeout(() => {
        setLoading(false);
        setUpdate();
      }, 500);
    });
  }

  useEffect(() => {
    if (locale.key && locale.value) {
      setEditMode(key !== locale.key || value !== locale.value);
    }
  }, [key, locale.key, value, locale.value]);

  useEffect(() => {
    if (locale.key && locale.value) {
      setKey(locale.key);
      setValue(locale.value);
    }
  }, [locale.key, locale.value]);

  return (
    <div className="inputs-form-component input-group mb-3">
      <span className="input-group-text">Key</span>
      <input
        type="text" className="form-control"
        value={key} onChange={(e) => setKey(e.target.value)}
      />
      <span className="input-group-text">Value</span>
      <input
        type="text" className="form-control"
        value={value} onChange={(e) => setValue(e.target.value)}
      />
      {newLocale ? (
        <span className="input-group-text btn btn-success" onClick={onAddLocale}>
          Add
        </span>
      ) : editMode ? (
        <span className="input-group-text btn btn-warning" onClick={onUpdateLocale}>
          Update
        </span>
      ) : (
        <span className="input-group-text btn btn-danger" onClick={onDeleteLocale}>
          Delete
        </span>
      )}
    </div>
  );
};
