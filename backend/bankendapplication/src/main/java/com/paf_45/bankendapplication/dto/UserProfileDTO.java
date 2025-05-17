package com.paf_45.bankendapplication.dto;

import java.util.ArrayList;
import java.util.List;

import com.paf_45.bankendapplication.model.UserProfile;

public class UserProfileDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String profileName;
    private List<String> skills = new ArrayList<>();
    private List<String> interests = new ArrayList<>();
    private String location;
    private String profession;
    private String education;
    private List<String> certifications = new ArrayList<>();
    private boolean isVerified;
    private int followersCount;
    private int followingCount;
    private String websiteUrl;
    private List<String> languages = new ArrayList<>();
    private String sub;  
    private String picture;  

    public static UserProfileDTO fromUserProfile(UserProfile userProfile) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(userProfile.getId());
        dto.setFirstName(userProfile.getFirstName());
        dto.setLastName(userProfile.getLastName());
        dto.setProfileName(userProfile.getProfileName());
        dto.setSkills(userProfile.getSkills());
        dto.setInterests(userProfile.getInterests());
        dto.setLocation(userProfile.getLocation());
        dto.setProfession(userProfile.getProfession());
        dto.setEducation(userProfile.getEducation());
        dto.setCertifications(userProfile.getCertifications());
        dto.setVerified(userProfile.isVerified());
        dto.setFollowersCount(userProfile.getFollowersCount());
        dto.setFollowingCount(userProfile.getFollowingCount());
        dto.setWebsiteUrl(userProfile.getWebsiteUrl());
        dto.setLanguages(userProfile.getLanguages());
        dto.setSub(userProfile.getSub());  // Add this line
        dto.setPicture(userProfile.getPicture());
        return dto;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getProfileName() { return profileName; }
    public void setProfileName(String profileName) { this.profileName = profileName; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public List<String> getCertifications() { return certifications; }
    public void setCertifications(List<String> certifications) { this.certifications = certifications; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public int getFollowersCount() { return followersCount; }
    public void setFollowersCount(int followersCount) { this.followersCount = followersCount; }

    public int getFollowingCount() { return followingCount; }
    public void setFollowingCount(int followingCount) { this.followingCount = followingCount; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public String getSub() { return sub; }
    public void setSub(String sub) { this.sub = sub; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
}