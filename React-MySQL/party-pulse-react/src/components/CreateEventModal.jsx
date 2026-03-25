import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../services/apiConfig';
import '../css/CreateEventModal.css';

const MUSIC_STYLES = [
    'Techno', 'House', 'Pop', 'Rock', 'Hip-Hop',
    'Drum & Bass', 'EDM', 'Reggaeton', 'R&B', 'Jazz', 'Latin', 'Trap', 'Trance'
];

const initialForm = {
    title: '',
    description: '',
    eventDateTime: '',
    locationName: '',
    address: '',
    ticketPrice: '',
    musicStyle: '',
    maxAttendees: '',
    isPublic: true,
    latitude: '',
    longitude: '',
};

const CreateEventModal = ({ open, onClose, onCreated, eventToEdit }) => {
    const [form, setForm] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (eventToEdit && open) {
            setForm({
                title: eventToEdit.name || '',
                description: eventToEdit.desc || '',
                eventDateTime: eventToEdit.rawDate ? eventToEdit.rawDate.substring(0, 16) : '',
                locationName: eventToEdit.place || '',
                address: eventToEdit.address || '',
                ticketPrice: eventToEdit.ticketPrice ?? '',
                musicStyle: eventToEdit.type === 'other' ? '' : (eventToEdit.type || ''), // handle initial empty value
                maxAttendees: eventToEdit.maxAttendees ?? '',
                isPublic: eventToEdit.isPublic ?? true,
                latitude: eventToEdit.lat !== null ? eventToEdit.lat.toString() : '',
                longitude: eventToEdit.lon !== null ? eventToEdit.lon.toString() : '',
            });
            // Try to set correct string matching MUSIC_STYLES case-insensitively
            if (eventToEdit.type) {
                const matchedStyle = MUSIC_STYLES.find(s => s.toLowerCase() === eventToEdit.type.toLowerCase() ||
                    (eventToEdit.type.toLowerCase() === 'electronic' && s === 'EDM') ||
                    (eventToEdit.type.toLowerCase() === 'drumandbass' && s === 'Drum & Bass') ||
                    (eventToEdit.type.toLowerCase() === 'hiphop' && s === 'Hip-Hop'));
                if (matchedStyle) setForm(prev => ({ ...prev, musicStyle: matchedStyle }));
            }
            setImagePreview(eventToEdit.img && !eventToEdit.img.includes('placeholder') ? eventToEdit.img : null);
        } else if (!open) {
            setForm(initialForm);
            setImagePreview(null);
            setImageFile(null);
            setError('');
            setSuccess('');
        }
    }, [eventToEdit, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!form.title.trim()) { setError('A buli neve kötelező!'); return; }
        if (!form.eventDateTime) { setError('Az időpont kötelező!'); return; }
        if (!form.musicStyle) { setError('A zenei stílus kiválasztása kötelező!'); return; }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('Title', form.title.trim());
            formData.append('Description', form.description.trim());
            formData.append('EventDateTime', new Date(form.eventDateTime).toISOString());
            formData.append('LocationName', form.locationName.trim());
            formData.append('Address', form.address.trim());
            formData.append('MusicStyle', form.musicStyle);
            formData.append('IsPublic', form.isPublic.toString());
            if (form.ticketPrice !== '') formData.append('TicketPrice', form.ticketPrice);
            if (form.maxAttendees !== '') formData.append('MaxAttendees', form.maxAttendees);
            if (form.latitude !== '') formData.append('Latitude', form.latitude);
            if (form.longitude !== '') formData.append('Longitude', form.longitude);
            if (imageFile) formData.append('Image', imageFile);

            const token = localStorage.getItem('token');
            if (eventToEdit) {
                await apiClient.put(`/Event/Update/${eventToEdit.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });
                setSuccess('🎉 A buli sikeresen frissítve!');
            } else {
                await apiClient.post('/Event/Create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });
                setSuccess('🎉 A buli sikeresen létrehozva!');
            }
            setForm(initialForm);
            setImageFile(null);
            setImagePreview(null);

            setTimeout(() => {
                setSuccess('');
                onCreated && onCreated();
                onClose();
            }, 1500);
        } catch (err) {
            const msg = err.response?.data || err.message || 'Ismeretlen hiba történt.';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setForm(initialForm);
        setImageFile(null);
        setImagePreview(null);
        setError('');
        setSuccess('');
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="cem-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <motion.div
                        className="cem-modal"
                        initial={{ opacity: 0, scale: 0.85, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 40 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    >
                        {/* Header */}
                        <div className="cem-header">
                            <div className="cem-header-left">
                                <span className="cem-icon">🎉</span>
                                <h2>{eventToEdit ? 'Buli Szerkesztése' : 'Új Buli Létrehozása'}</h2>
                            </div>
                            <button className="cem-close-btn" onClick={handleClose} disabled={loading}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <form className="cem-form" onSubmit={handleSubmit}>
                            <div className="cem-scroll-area">

                                {/* Buli neve */}
                                <div className="cem-field cem-field-full">
                                    <label>
                                        <i className="fas fa-star"></i> Buli neve <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="pl. Neon Night 2026..."
                                        maxLength={120}
                                        required
                                    />
                                </div>

                                {/* Leírás */}
                                <div className="cem-field cem-field-full">
                                    <label>
                                        <i className="fas fa-align-left"></i> Leírás
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Írd le a bulid részleteit..."
                                        rows={3}
                                        maxLength={2000}
                                    />
                                </div>

                                {/* Időpont + Zenei stílus */}
                                <div className="cem-row">
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-calendar-alt"></i> Időpont <span className="required">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="eventDateTime"
                                            value={form.eventDateTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-music"></i> Zenei stílus <span className="required">*</span>
                                        </label>
                                        <select
                                            name="musicStyle"
                                            value={form.musicStyle}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Válassz stílust --</option>
                                            {MUSIC_STYLES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Helyszín + Cím */}
                                <div className="cem-row">
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-map-marker-alt"></i> Helyszín neve
                                        </label>
                                        <input
                                            type="text"
                                            name="locationName"
                                            value={form.locationName}
                                            onChange={handleChange}
                                            placeholder="pl. Las Vegas Klub"
                                        />
                                    </div>
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-road"></i> Cím
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="pl. Miskolc, Mindszent tér 1."
                                        />
                                    </div>
                                </div>

                                {/* Jegyár + Max létszám */}
                                <div className="cem-row">
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-ticket-alt"></i> Jegyár (Ft)
                                        </label>
                                        <input
                                            type="number"
                                            name="ticketPrice"
                                            value={form.ticketPrice}
                                            onChange={handleChange}
                                            placeholder="0 = ingyenes"
                                            min="0"
                                            step="100"
                                        />
                                    </div>
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-users"></i> Max. létszám
                                        </label>
                                        <input
                                            type="number"
                                            name="maxAttendees"
                                            value={form.maxAttendees}
                                            onChange={handleChange}
                                            placeholder="pl. 500"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {/* Koordináták (opcionális) */}
                                <div className="cem-row">
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-globe"></i> Szélességi fok (Lat)
                                        </label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            value={form.latitude}
                                            onChange={handleChange}
                                            placeholder="pl. 48.1035"
                                            step="0.000001"
                                        />
                                    </div>
                                    <div className="cem-field">
                                        <label>
                                            <i className="fas fa-globe"></i> Hosszúsági fok (Lon)
                                        </label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            value={form.longitude}
                                            onChange={handleChange}
                                            placeholder="pl. 20.7784"
                                            step="0.000001"
                                        />
                                    </div>
                                </div>

                                {/* Nyilvános kapcsoló */}
                                <div className="cem-field cem-field-toggle">
                                    <label className="cem-toggle-label">
                                        <div className="cem-toggle-info">
                                            <i className={`fas ${form.isPublic ? 'fa-globe' : 'fa-lock'}`}></i>
                                            <span>{form.isPublic ? 'Nyilvános buli' : 'Privát buli'}</span>
                                            <span className="cem-toggle-hint">
                                                {form.isPublic ? 'Mindenki láthatja' : 'Csak meghívottak látják'}
                                            </span>
                                        </div>
                                        <div
                                            className={`cem-toggle-switch ${form.isPublic ? 'active' : ''}`}
                                            onClick={() => setForm(p => ({ ...p, isPublic: !p.isPublic }))}
                                        >
                                            <div className="cem-toggle-knob"></div>
                                        </div>
                                    </label>
                                </div>

                                {/* Kép feltöltés */}
                                <div className="cem-field cem-field-full">
                                    <label>
                                        <i className="fas fa-image"></i> Borítókép
                                    </label>
                                    <div
                                        className={`cem-dropzone ${imagePreview ? 'has-image' : ''}`}
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Előnézet" className="cem-image-preview" />
                                                <div className="cem-image-overlay">
                                                    <i className="fas fa-camera"></i>
                                                    <span>Kép cseréje</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="cem-dropzone-placeholder">
                                                <i className="fas fa-cloud-upload-alt"></i>
                                                <p>Húzd ide a képet vagy kattints a feltöltéshez</p>
                                                <span>JPG, PNG, WebP • Max. 10 MB</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {/* Üzenetek */}
                                {error && (
                                    <motion.div
                                        className="cem-alert cem-alert-error"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <i className="fas fa-exclamation-circle"></i> {error}
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div
                                        className="cem-alert cem-alert-success"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <i className="fas fa-check-circle"></i> {success}
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="cem-footer">
                                <button
                                    type="button"
                                    className="cem-btn-cancel"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Mégse
                                </button>
                                <motion.button
                                    type="submit"
                                    className="cem-btn-submit"
                                    disabled={loading}
                                    whileHover={!loading ? { scale: 1.04 } : {}}
                                    whileTap={!loading ? { scale: 0.97 } : {}}
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-circle-notch fa-spin"></i>
                                            Mentés...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-rocket"></i>
                                            {eventToEdit ? 'Mentés' : 'Buli közzététele!'}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateEventModal;
